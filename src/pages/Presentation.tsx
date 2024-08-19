// import { Box, Button, Grid, Pagination, Stack, Typography, useTheme } from "@mui/material";
// import React, { useState } from "react";
// import MainSlider from "../components/Presentation/MainSlider";
// import PresentationInfo from "../components/Presentation/PresentationInfo";
// import CardsSlide from "../components/Presentation/CardsSlide";
// import EditPresentations from "../components/Presentation/EditPresentations";
// import DeleteModal from "../components/Global/DeleteModal";
// import { Add } from "@mui/icons-material";
// import { useTranslation } from "react-i18next";
// import jwtInterceoptor from "../services/interceptors";
// import { useSnackbar } from "../components/Global/WithSnackbar";
// import { ProgressLoader } from "../components/Global/GlobalLoader";

// const API_URL = process.env.REACT_APP_API_PROFILE_SERVICE_URL;

// function Presentation() {
//   const [edit, setEdit] = useState({
//     edit: false,
//     id: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const { showMessage } = useSnackbar();
//   const [presentations, setPresentations] = useState([]);
//   const [selected, setSelected] = useState(6);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const { t } = useTranslation();
//   const theme = useTheme();

//   const roleskey = sessionStorage.getItem("roles");
//   const email = sessionStorage.getItem("email_key");
//   let isManagerOrAdmin =
//     roleskey.includes("Manager") || roleskey.includes("Admin")
//       ? "flex"
//       : "none";

//   const getPresentation = () => {
//     return presentations.find((item) => item.id === selected);
//   };

//   const selectPresentation = (id) => {
//     setSelected(id);
//   };

//   const handleDelete = () => {
//     setDeleteModal(true);
//   };

//   const onEditClick = () => {
//     setEdit({ edit: true, id: selected });
//   };

//   const onAddClick = () => {
//     setEdit({ edit: true, id: "" });
//   };

//   const getPresentations = async () => {
//     setLoading(true);
//     jwtInterceoptor
//       .get("api/PresentationDetail/GetAllPresentationDetail")
//       .then((res) => {
//         let presentationList = [];
//         for (var row of res.data) {
//           console.log(row);
//           let item = {
//             id: row.companyDetailId,
//             img: getFullUrl(row),
//             title: row.title,
//             posted: new Date(row.createdDate).toLocaleDateString("en-GB"),
//             format: "Pdf",
//             user: {
//               name: row.createdByUserName,
//               img:
//                 process.env.REACT_APP_API_PROFILE_SERVICE_URL +
//                 "/api/Employee/GetProfilePictureFileStream?EmployeeDetailId=" +
//                 row.createdByEmployeeId + "&email=" + email,
//             },
//             description: row.description,
//             presentations: [],
//             isVisibleToUser: row.isVisibleToUser ?? true,
//           };
//           if (row.fileName != null) {
//             for (var filename of row.fileName.split(",")) {
//               let presentationItem = {
//                 url: getUrl(row.companyDetailId, filename),
//                 name: filename ?? "image1",
//                 type: filename.split(".")[1],
//               };
//               item.presentations.push(presentationItem);
//             }
//             presentationList.push(item);
//           }
//         }
//         setSelected(presentationList[0].id);
//         setPresentations(presentationList);
//         console.log(presentationList);
//       })
//       .catch((err) => {
//         showMessage(err.message, "error");
//       })
//       .finally(() => setLoading(false));
//   };

//   const getFullUrl = (item) => {
//     return item.fileName
//       ? API_URL +
//       "api/PresentationDetail/OpenPresentationDetailFile/" +
//       item.companyDetailId +
//       "/" +
//       item.fileName.split(",")[0] + "?email=" + email
//       : "";
//   };
//   const getUrl = (id, fileName) => {
//     return (
//       API_URL +
//       "api/PresentationDetail/OpenPresentationDetailFile/" +
//       id +
//       "/" +
//       fileName + "?email=" + email
//     );
//   };

//   const createNewPresentationConfig = async (data) =>
//     jwtInterceoptor
//       .post("api/PresentationDetail/CreatePresentationDetail", data)
//       .then((res) => {
//         showMessage("Presentation created successfully", "success");
//         getPresentations();
//       })
//       .catch((err) => {
//         showMessage(err.message, "error");
//       });

//   const updatePresentationConfig = async (data) =>
//     jwtInterceoptor
//       .post("api/PresentationDetail/UpdatePresentationDetail", data)
//       .then((res) => {
//         showMessage("Presentation Updated successfully", "success");
//         getPresentations();
//       })
//       .catch((err) => {
//         showMessage(err.message, "error");
//       });

//   const deletePresentationFile = async (id, fileName) =>
//     jwtInterceoptor
//       .delete(
//         `api/PresentationDetail/DeletePresentationDetailFile?CompanyDetailId=${id}&file=${fileName}`
//       )
//       .then((res) => {
//         showMessage("Presentation Updated successfully", "success");
//         getPresentations();
//       })
//       .catch((err) => {
//         showMessage(err.message, "error");
//       });

//   const deleteDeletedPresentationFiles = async (deletedFiles, id) => {
//     await Promise.all(
//       deletedFiles.map((file) => deletePresentationFile(id, file.name))
//     );

//     getPresentations();
//   };

//   const deletePresentationConfig = async (id) =>
//     jwtInterceoptor
//       .delete(
//         `api/PresentationDetail/DeletePresentationDetail?CompanyDetailId=${id}`
//       )
//       .then((res) => {
//         showMessage("Presentation Updated successfully", "success");
//         getPresentations();
//       })
//       .catch((err) => {
//         showMessage(err.message, "error");
//       });

//   React.useEffect(() => {
//     getPresentations();
//   }, []);

//   const UploadDocuments_Click = (data) => {
//     //console.log("Save data"+data.Title);
//     if (!edit.id) createNewPresentationConfig(data);
//     else updatePresentationConfig(data);
//   };

//   return (
//     <Box
//       sx={{
//         borderRadius: "20px",
//         // p: "15px",
//         // mt: "15px",
//         // pr: "40px",
//         p: 2
//         // width: "98%",
//       }}
//     >
//       <ProgressLoader loading={loading} />
//       <Stack direction="row" alignItems="center" justifyContent="space-between">
//         <Typography variant="h6">{t("Company presentation")}</Typography>
//         <Button
//           variant="outlined"
//           sx={{
//             padding: "10px",
//             width: "fit-content",
//             display: isManagerOrAdmin,
//           }}
//           onClick={onAddClick}
//         >
//           <Add />
//           {t("Add New")}
//         </Button>
//       </Stack>
//       <Grid
//         sx={{
//           border: (theme) => `1px solid ${theme.palette.common.border}`,
//           borderRadius: "20px",
//           p: 3,
//           mt: 2,
//           width: "50%",
//           // height: "55vh",
//           [theme.breakpoints.down("md")]: {
//             height: "auto",
//           },
//           // width: "75vw"
//         }}
//         container
//         // spacing={3}
//       >
//         <Grid item xs={12} md={7} >
//           <MainSlider
//             slides={presentations.length > 0 && getPresentation().presentations}
//           />

//         </Grid>
//         <Grid item xs={12} md={5} pl={3}>
//           <PresentationInfo
//             onEditClick={onEditClick}
//             selected={presentations.length > 0 && getPresentation()}
//             handleDelete={handleDelete}
//             isManagerOrAdmin={isManagerOrAdmin}
//           />
//         </Grid>
//       </Grid>

//       <CardsSlide
//         presentations={presentations.length > 0 && presentations}
//         selectPresentation={selectPresentation}
//       />
//       <EditPresentations
//         id={edit.id}
//         open={edit.edit}
//         onClose={() => {
//           setEdit({ edit: false, id: "" });
//         }}
//         onSave={({ formDataFiles, removedFiles }) => {
//           deleteDeletedPresentationFiles(removedFiles, edit.id);
//           UploadDocuments_Click(formDataFiles);
//         }}
//         data={
//           presentations.length > 0 &&
//           presentations.find((item) => item.id === edit.id)
//         }
//       />
//       <DeleteModal
//         message={"Are you sure you want to delete this presentation?"}
//         onCancel={() => {
//           setDeleteModal(false);
//         }}
//         onConfirm={() => {
//           deletePresentationConfig(selected);
//           setDeleteModal(false);
//         }}
//         title={"Delete presentation"}
//         open={deleteModal}
//       />

//       <Box sx={{ display: "flex", justifyContent: "center" }}>
//         <Pagination count={presentations.length} color="primary" />
//       </Box>
//     </Box>
//   );
// }

// export default Presentation;

import {
  Box,
  Button,
  Grid,
  Pagination,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import MainSlider from '../components/Presentation/MainSlider';
import PresentationInfo from '../components/Presentation/PresentationInfo';
import CardsSlide from '../components/Presentation/CardsSlide';
import EditPresentations from '../components/Presentation/EditPresentations';
import DeleteModal from '../components/Global/DeleteModal';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import jwtInterceoptor from '../services/interceptors';
import { useSnackbar } from '../components/Global/WithSnackbar';
import { ProgressLoader } from '../components/Global/GlobalLoader';

const API_URL = process.env.REACT_APP_API_PROFILE_SERVICE_URL;

function Presentation() {
  const [edit, setEdit] = useState<any>({
    edit: false,
    id: '',
  });
  // const [currentSlide, setCurrentSlide] = useState<any>(1);
  const [activePage, setActivePage] = useState<number>(0);
  const [loading, setLoading] = useState<any>(false);
  const { showMessage }: any = useSnackbar();
  const [presentations, setPresentations] = useState<any>([]);
  const [selected, setSelected] = useState<any>(0); // Change selected state to be the index
  const [deleteModal, setDeleteModal] = useState<any>(false);
  const { t } = useTranslation();
  const theme = useTheme();

  const roleskey: any = sessionStorage.getItem('roles');
  const email: any = sessionStorage.getItem('email_key');
  let isManagerOrAdmin =
    roleskey.includes('Manager') || roleskey.includes('Admin')
      ? 'flex'
      : 'none';

  const getPresentation = () => {
    return presentations.find((item: any) => item.id === selected);
  };

  // const changePage = (page: any) => {
  //   if (page) {
  //     setSelected(presentations[page]?.id);
  //   }
  // };

  const selectPresentation = (id: any) => {
    setSelected(id);
  };

  const onEditClick = () => {
    setEdit({ edit: true, id: selected });
  };

  const onAddClick = () => {
    setEdit({ edit: true, id: '' });
  };

  const getPresentations = () => {
    setLoading(true);
    jwtInterceoptor
      .get('api/PresentationDetail/GetAllPresentationDetail')
      .then((res: any) => {
        let presentationList = [];
        for (var row of res.data) {
          console.log(row);
          let item: any = {
            id: row.companyDetailId,
            img: getFullUrl(row),
            title: row.title,
            posted: new Date(row.createdDate).toLocaleDateString('en-GB'),
            format: 'Pdf',
            user: {
              name: row.createdByUserName,
              img:
                process.env.REACT_APP_API_PROFILE_SERVICE_URL +
                '/api/Employee/GetProfilePictureFileStream?EmployeeDetailId=' +
                row.createdByEmployeeId +
                '&email=' +
                email,
            },
            description: row.description,
            presentations: [],
            isVisibleToUser: row.isVisibleToUser ?? true,
          };
          if (row.fileName != null) {
            for (var filename of row.fileName.split(',')) {
              let presentationItem = {
                url: getUrl(row.companyDetailId, filename),
                name: filename ?? 'image1',
                type: filename.split('.')[1],
              };
              item.presentations.push(presentationItem);
            }
            presentationList.push(item);
          }
        }
        setSelected(presentationList[0].id);
        setPresentations(presentationList);
        console.log(presentationList);
      })
      .catch((err: any) => {
        showMessage(err.message, 'error');
      })
      .finally(() => setLoading(false));
  };

  const getFullUrl = (item: any) => {
    return item.fileName
      ? API_URL +
      'api/PresentationDetail/OpenPresentationDetailFile/' +
      item.companyDetailId +
      '/' +
      item.fileName.split(',')[0] +
      '?email=' +
      email
      : '';
  };
  const getUrl = (id: any, fileName: any) => {
    return (
      API_URL +
      'api/PresentationDetail/OpenPresentationDetailFile/' +
      id +
      '/' +
      fileName +
      '?email=' +
      email
    );
  };

  const createNewPresentationConfig = async (data: any) =>
    jwtInterceoptor
      .post('api/PresentationDetail/CreatePresentationDetail', data)
      .then((res: any) => {
        showMessage('Presentation created successfully', 'success');
        getPresentations();
      })
      .catch((err: any) => {
        showMessage(err.message, 'error');
      });

  const updatePresentationConfig = async (data: any) =>
    jwtInterceoptor
      .post('api/PresentationDetail/UpdatePresentationDetail', data)
      .then((res: any) => {
        showMessage('Presentation Updated successfully', 'success');
        getPresentations();
      })
      .catch((err: any) => {
        showMessage(err.message, 'error');
      });

  const deletePresentationFile = async (id: any, fileName: any) =>
    jwtInterceoptor
      .delete(
        `api/PresentationDetail/DeletePresentationDetailFile?CompanyDetailId=${id}&file=${fileName}`
      )
      .then((res: any) => {
        showMessage('Presentation Updated successfully', 'success');
        getPresentations();
      })
      .catch((err: any) => {
        showMessage(err.message, 'error');
      });

  const deleteDeletedPresentationFiles = async (deletedFiles: any, id: any) => {
    await Promise.all(
      deletedFiles.map((file: any) => deletePresentationFile(id, file.name))
    );

    getPresentations();
  };

  const deletePresentationConfig = async (id: any) =>
    jwtInterceoptor
      .delete(
        `api/PresentationDetail/DeletePresentationDetail?CompanyDetailId=${id}`
      )
      .then((res: any) => {
        showMessage('Presentation Updated successfully', 'success');
        getPresentations();
      })
      .catch((err: any) => {
        showMessage(err.message, 'error');
      });

  React.useEffect(() => {
    getPresentations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const UploadDocuments_Click = (data: any) => {
    //console.log("Save data"+data.Title);
    if (!edit.id) createNewPresentationConfig(data);
    else updatePresentationConfig(data);
  };

  const totalPages = Math.ceil(presentations.length / 3);

  return (
    <Box
      sx={{
        // borderRadius: '20px',
        // p: "15px",
        // mt: "15px",
        // pr: "40px",
        p: 2,
        width: '100%',
      }}
    >
      <ProgressLoader loading={loading} />
      <Stack direction='row' alignItems='center' justifyContent='space-between'>
        <Box
          sx={(theme) => ({
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            fontSize: '20px',
            fontWeight: 500,
          })}
        >
          <Typography
            sx={{
              color: '#18A0FB',
            }}
            variant='h6'
          >
            {t('Corporate documents')}
          </Typography>
        </Box>

        <Button
          variant='outlined'
          sx={{
            padding: '10px',
            width: 'fit-content',
            display: isManagerOrAdmin,
          }}
          onClick={onAddClick}
        >
          <Add />
          {t('Add New')}
        </Button>
      </Stack>
      <Grid
        sx={{
          // border: (theme) => `1px solid ${theme.palette.common.black}`,
          borderRadius: '20px',
          p: 3,
          mt: 2,
          width: '100%',
          maxWidth: '77vw',
          // height: "55vh",
          [theme.breakpoints.down('md')]: {
            height: 'auto',
          },
          // width: "75vw"
        }}
        container
      // spacing={3}
      >
        <Grid item xs={12} md={8}>
          <MainSlider
            slides={
              presentations?.length > 0 && getPresentation()?.presentations
            }
          />
        </Grid>
        <Grid item xs={12} md={4} pl={3}>
          <PresentationInfo
            onEditClick={onEditClick}
            selected={presentations?.length > 0 && getPresentation()}
            isManagerOrAdmin={isManagerOrAdmin}
          />
        </Grid>
      </Grid>

      <EditPresentations
        id={edit.id}
        open={edit.edit}
        onClose={() => {
          setEdit({ edit: false, id: '' });
        }}
        onSave={({ formDataFiles, removedFiles }: any) => {
          if(removedFiles){
            deleteDeletedPresentationFiles(removedFiles, edit.id);
          }
          UploadDocuments_Click(formDataFiles);
        }}
        data={
          presentations?.length > 0 &&
          presentations?.find((item: any) => item.id === edit.id)
        }
      />
      <DeleteModal
        message={'Are you sure you want to delete this presentation?'}
        onCancel={() => {
          setDeleteModal(false);
        }}
        onConfirm={() => {
          deletePresentationConfig(selected);
          setDeleteModal(false);
        }}
        title={'Delete presentation'}
        open={deleteModal}
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          maxWidth: '77vw',
        }}
      >
        <Box style={{ width: '100%' }}>
          <Box style={{ width: '100%' }}>
            <CardsSlide
              presentations={presentations.length > 0 && presentations}
              selectPresentation={selectPresentation}
              activePage={activePage}
              setActivePage={setActivePage}
              selected={selected}
            />
          </Box>
          <Box
            sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}
          >
            <Pagination
              count={totalPages}
              color='primary'
              page={activePage}
              onChange={(event, page) => {
                setActivePage(page);
              }}
              sx={(theme) => ({
                '& .Mui-selected': {
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.background.paper,
                },
              })}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Presentation;
