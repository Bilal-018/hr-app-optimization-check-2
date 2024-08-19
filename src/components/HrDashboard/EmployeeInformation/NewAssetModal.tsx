import React, { useEffect, useState, useRef } from 'react';
import EnhancedTable from '../../Global/Table';
import { Checkbox, Stack, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import BaseModal from '../../Global/Modal';
// import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import jwtInterceptor from '../../../services/interceptors';
import { useSnackbar } from '../../Global/WithSnackbar';

interface State {
  label: string;
  color: 'success' | 'warning';
}

const states: State[] = [
  {
    label: 'Granted',
    color: 'success',
  },
  {
    label: 'Returned',
    color: 'warning',
  },
];

interface HeadCell {
  id: string;
  label: string;
}

const headCells: HeadCell[] = [
  {
    id: 'equipment',
    label: 'Equipment',
  },
  {
    id: 'brand',
    label: 'Brand',
  },
  {
    id: 'model',
    label: 'Model',
  },
  {
    id: 'registrationNumber',
    label: 'Registration Number',
  },
  {
    id: 'status',
    label: 'Status',
  },
  {
    id: 'action',
    label: 'Action',
  },
];

interface RowData {
  equipment: string;
  brand: string;
  model: string;
  registrationNumber: string;
  status: JSX.Element;
  comments: string;
}

function createData(
  equipment: string,
  brand: string,
  model: string,
  registrationNumber: string,
  status: JSX.Element,
  comments: string
): RowData {
  return {
    equipment,
    brand,
    model,
    registrationNumber,
    status,
    comments,
  };
}

interface StatusProps {
  item: any; // You should define the actual type
  handleChange: (assetStatus: boolean, assetItem: any) => void; // You should define the actual type
}

function Status({ item, handleChange }: StatusProps) {
  const [isAssetAssigned, setIsAssetAssigned] = useState<boolean>(
    item.isAssetAssigned
  );

  const handleCheckboxChange = (check: boolean) => {
    setIsAssetAssigned(check);
    handleChange(check, item);
  };

  return (
    <Stack direction='row' gap='5px' alignItems='center'>
      <Checkbox
        checked={isAssetAssigned}
        color={'success'}
        onChange={() => { handleCheckboxChange(true) }}
      />
      <Checkbox
        checked={!isAssetAssigned}
        color={'warning'}
        onChange={() => { handleCheckboxChange(false) }}
      />
    </Stack>
  );
}

// interface NewAssetModalProps {
//   open: boolean;
//   handleClose: () => void;
//   title: string;
//   selectedId: string; // You should define the actual type
//   onSave: () => void;
//   data: any; // You should define the actual type
//   setData: React.Dispatch<any>; // You should define the actual type
// }

const NewAssetModal: React.FC<any> = ({
  open,
  handleClose,
  title,
  selectedId,
}) => {
  // const bearerToken = sessionStorage.getItem('token_key');
  // const empId = sessionStorage.getItem('empId_key');

  // const navigate = useNavigate();
  const [assetData, setAssetData] = useState<RowData[]>([]);
  const [assignAssets, setAssignAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { showMessage }: any = useSnackbar();

  const initialized = useRef(false);

  const checkboxChanged = (assetStatus: boolean, assetItem: any) => {
    setAssignAssets((prevData) => {
      return prevData.map((item) => {
        if (assetItem.assetConfigurationId === item.assetConfigurationId) {
          return { ...item, isAssetAssigned: assetStatus };
        }
        return item;
      });
    });
  };

  const getAssetsListData = () => {
    setLoading(true);
    let url =
      'api/HrAsset/GetAssetListByEmployeeId?EmployeeDetailId=' + selectedId;

    jwtInterceptor
      .get(url)
      .then((response: any) => {
        let tblRows: RowData[] = [];
        for (var x of response.data) {
          let item = x;
          tblRows.push(
            createData(
              x.equipment,
              x.brand,
              x.model,
              x.registration,
              <Status item={item} handleChange={checkboxChanged} />,
              x.comment
            )
          );
        }
        setAssetData(tblRows);
        setAssignAssets(response.data);
      })
      .finally(() => { setLoading(false) });
  };

  useEffect(() => {
    if (open && !initialized.current) {
      setAssetData([]);
      initialized.current = true;
      getAssetsListData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialized.current]);

  const save = () => {
    void assignAssetsToEmployee();
  };

  const close = () => {
    initialized.current = false;
    handleClose();
  };

  const assignAssetsToEmployee = async () => {
    let assignedAssets: any | undefined = [];
    assignAssets.forEach((asset) => {
      let item = {
        assetConfigurationId: asset.assetConfigurationId,
        registration: asset.registration,
        isAssetAssigned: asset.isAssetAssigned,
        comment: asset.comment,
      };
      assignedAssets.push(item);
    });

    let url = 'api/HrAsset/AddUpdateAssignAsset?EmployeeDetailId=' + selectedId;

    jwtInterceptor.post(url, assignedAssets).then((response: any) => {
      showMessage(response.data, 'success');
    });

    initialized.current = false;
    handleClose();
  };

  const { t } = useTranslation();

  return (
    <BaseModal
      open={open}
      handleClose={close}
      title={title}
      onSave={save}
      sx={{
        maxWidth: 'fit-content',
      }}
    >
      <EnhancedTable
        head={headCells}
        rows={assetData}
        hidePagination
        loading={loading}
        title={undefined}
        onAddClick={undefined}
      />
      <Stack
        direction='row'
        justifyContent='center'
        alignItems='center'
        gap={2}
      >
        {states.map((state, i) => (
          <Stack direction='row' gap='5px' alignItems='center' key={i}>
            <CircleIcon fontSize='medium' color={state.color} />
            <Typography fontSize='Small'>{t(state.label)}</Typography>
          </Stack>
        ))}
      </Stack>
    </BaseModal>
  );
};

export default NewAssetModal;
