import React, { useEffect, useState, useRef } from 'react';
import EnhancedTable from '../../../Global/Table';
import jwtInterceptor from '../../../../services/interceptors';
import { Stack, Typography, Checkbox } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import EditAndSave from '../../../Global/EditAndSave';
import { useSnackbar } from '../../../Global/WithSnackbar';

const headCells = [
  {
    id: 'Equipment',
    label: 'Equipment',
  },
  {
    id: 'Brand',
    label: 'Brand',
  },
  {
    id: 'Model',
    label: 'Model',
  },
  {
    id: 'Registration',
    label: 'Registration',
  },
  {
    id: 'Status',
    label: 'Status',
  },
  {
    id: 'Comment',
    label: 'Comment',
  },
];

function createData(
  Equipment: any,
  Brand: any,
  Model: any,
  Registration: any,
  Status: any,
  Comment: any,
  searchableText: string,
) {
  return {
    Equipment,
    Brand,
    Model,
    Registration,
    Status,
    Comment,
    searchableText,
  };
}

function Assets({ modal = false }) {
  //const [open, setOpen] = useState(false);
  const bearerToken = sessionStorage.getItem('token_key');
  const empId = sessionStorage.getItem('employee_id_key') ? sessionStorage.getItem('employee_id_key') : sessionStorage.getItem('empId_key');

  const [assets, setAssetState] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const [edit, setEdit] = useState<any>(false);
  const initialized = useRef(false);
  const tblRows: any = [];
  const [equipData, setEquipData] = React.useState<any>([]);
  const { showMessage }: any = useSnackbar();
  const base_url = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    if (!initialized.current) {
      if (bearerToken) {
        initialized.current = true;
        void GetAssetsListData();
      } else {
        window.location.href = base_url + '/login';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAssetConfig = async () => {
    const response = await jwtInterceptor.get('api/HrAsset/GetAllAssetConfigurationList');
    return response;
  };

  const updateAssets = async () => {
    const [AssetsData] = await Promise.all([
      getAssetConfig()
    ]);
    const assetConfigData = AssetsData.data.allAssets.filter((asset: any) => asset.isActive).map(({ ...asset }: {[key: string]: any }) => asset);

    const updatedEquipData = equipData.filter((item: any) => 'isAssetAssigned' in item).map((equip: any) => {
      const matchingConfig = assetConfigData.find((config: any) => config.equipment === equip.equipment);
      if (matchingConfig) {
        return { ...equip, assetConfigurationId: matchingConfig.assetConfigurationId };
      }
      return equip;
    });

    let url = 'api/HrAsset/AddUpdateAssignAsset?EmployeeDetailId=' + empId;

    jwtInterceptor.post(url, updatedEquipData).then((response: any) => {
      showMessage(response.data, 'success');
    }).then(() => {
      setEdit(false);
      GetAssetsListData();
    })
  }

  const GetAssetsListData = async () => {
    setLoading(true);

    if (modal) {
      const [assetListResponse, assetConfigResponse] = await Promise.all([
        jwtInterceptor.get('api/Employee/GetAssetList?EmployeeDetailId=' + empId),
        getAssetConfig(),
      ]);

      const assetListData = assetListResponse.data;
      const assetConfigData = assetConfigResponse.data.allAssets.filter((asset: any) => asset.isActive).map(({ isActive, ...asset }: { isActive: boolean, [key: string]: any }) => asset);

      const updatedAssetListData = assetListData.map((asset: any) => {
        const config = assetConfigData.find((config: any) => config.equipment === asset.equipment);
        if (config) {
          asset.assetConfigurationId = config.assetConfigurationId;
        }
        return asset;
      });

      const mergedData = [...updatedAssetListData, ...assetConfigData.filter((config: any) => {
        return !updatedAssetListData.find((asset: any) => asset.equipment === config.equipment);
      })];

      for (const asset of mergedData) {
        let status = asset?.isAssetAssigned === false ? 'Not Assigned' : asset?.isAssetAssigned ? 'Assigned' : '';

        // Combine all text for searchable text
        const searchableText = [
          asset.equipment,
          asset.brand,
          asset.model,
          asset.registration,
          status,
          asset.comment,
        ].join(' ');

        tblRows.push(
          createData(
            asset.equipment,
            asset.brand,
            asset.model,
            asset.registration,
            modal ? (
              <Stack direction="row" alignItems="center" gap={2}>
                <Checkbox checked={status === 'Assigned'}
                  color='success'
                  sx={{
                    '&.MuiCheckbox-root': {
                      p: 0
                    },
                    "& .MuiSvgIcon-root": {
                      fill: (theme) => theme.palette.success.main,
                    },
                  }} />
                <Checkbox checked={status === 'Not Assigned'} color='error' sx={{
                  '&.MuiCheckbox-root': {
                    p: 0
                  },
                  "& .MuiSvgIcon-root": {
                    fill: (theme) => theme.palette.error.main,
                  },
                }} />
                <Checkbox color='warning' checked={status !== 'Assigned' && status !== 'Not Assigned' && status === 'Unknown'} sx={{
                  '&.MuiCheckbox-root': {
                    p: 0
                  },
                  "& .MuiSvgIcon-root": {
                    fill: (theme) => theme.palette.warning.main,
                  },
                }} />
              </Stack>) :
              (
                <Stack direction="row" alignItems="center" gap={1} fontSize={12}>
                  <CircleIcon color={status === 'Assigned' ? "success" : "error"} fontSize="inherit" />
                  <Typography sx={{ fontSize: 12 }}>{status === 'Assigned' ? "Granted" : "N/A"}</Typography>
                </Stack >
              ),
            asset.comment,
            searchableText
          )
        );
      }
      setAssetState(tblRows);
      setLoading(false);
    } else {
      jwtInterceptor
        .get('api/Employee/GetAssetList?EmployeeDetailId=' + empId)
        .then((response: any) => {
          for (var x of response.data) {
            let status = x.isAssetAssigned ? 'Assigned' : 'Not Assigned';
            console.log('123', response.data);

            const stat= status === 'Assigned' ? "Granted" : "N/A"
            // Combine all text for searchable text
            const searchableText = [
              x.equipment,
              x.brand,
              x.model,
              x.registration,
              stat,
              x.comment,
            ].join(' ');
            tblRows.push(
              createData(
                x.equipment,
                x.brand,
                x.model,
                x.registration,
                modal ? (
                  <Stack direction="row" alignItems="center" gap={2}>
                    <Checkbox checked={status === 'Assigned'}
                      color='success'
                      sx={{
                        '&.MuiCheckbox-root': {
                          p: 0
                        },
                        "& .MuiSvgIcon-root": {
                          fill: (theme) => theme.palette.success.main,
                        },
                      }} />
                    <Checkbox checked={status === 'Not Assigned'} color='error' sx={{
                      '&.MuiCheckbox-root': {
                        p: 0
                      },
                      "& .MuiSvgIcon-root": {
                        fill: (theme) => theme.palette.error.main,
                      },
                    }} />
                    <Checkbox color='warning' checked={status !== 'Assigned' && status !== 'Not Assigned' && status === 'Unknown'} sx={{
                      '&.MuiCheckbox-root': {
                        p: 0
                      },
                      "& .MuiSvgIcon-root": {
                        fill: (theme) => theme.palette.warning.main,
                      },
                    }} />
                  </Stack>) :
                  (
                    <Stack direction="row" alignItems="center" gap={1} fontSize={12}>
                      <CircleIcon color={status === 'Assigned' ? "success" : "error"} fontSize="inherit" />
                      <Typography sx={{ fontSize: 12 }}>{status === 'Assigned' ? "Granted" : "N/A"}</Typography>
                    </Stack >
                  ),
                x.comment,
                searchableText,
              )
            );
          }
          setAssetState(tblRows);
        })
        .finally(() => { setLoading(false) });
    }
  };

  return (
    <>
      {modal && <EditAndSave
        edit={edit}
        setEdit={setEdit}
        onUpdate={updateAssets}
        onCancel={() => { }}
        modal={modal}
      />}
      <EnhancedTable
        title={modal ? 'Asset information' : 'Assets'}
        head={headCells}
        rows={assets}
        loading={loading}
        edit={edit}
        isModal={modal}
        setEquipData={setEquipData}
      />
    </>
  );
}

export default Assets;
