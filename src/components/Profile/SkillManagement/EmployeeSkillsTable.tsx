/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
} from "react";
import EnhancedTable from "../../Global/Table";
import { CircularChip, RoundedChip } from "../../Global/Chips";
import {
  Box,
  CircularProgress,
  Grid,
  MenuItem,
  ToggleButton,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
// import DeleteIcon from '@mui/icons-material/Delete';
import BaseModal from "../../Global/Modal";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DragAndDrop from "../../Global/DragAndDrop";
import DeleteModal from "../../Global/DeleteModal";
import SkillsService from "../../../services/skillsManagementServicet";
import { useNavigate } from "react-router-dom";
import jwtInterceptor from "../../../services/interceptors";
import { useSnackbar } from "../../Global/WithSnackbar";
import { useTranslation } from "react-i18next";
import Select from "../../Global/Select";
import Attachment from "../../../assets/images/Attachment";
import CalendarIcon from "../../Icon/CalenderIcon";
import FileIcon from "../../Icon/FileIcon";
import EditIcon from "../../Icon/EditIcon";
import BinIcon from "../../Icon/BinIcon";
import dayjs from "dayjs";

const headCells = [
  {
    id: "skills",
    label: "Skills",
  },
  {
    id: "expertise",
    label: "Expertise",
  },
  {
    id: "achieved",
    label: "Achieved",
  },
  {
    id: "required",
    label: "Required",
  },
  {
    id: "attachment",
    label: "Attachment",
  },
  {
    id: "modified",
    label: "Modified",
  },
  {
    id: "modifiedby",
    label: "Modified By",
  },
  // {
  //   id: 'Renewal date',
  //   label: 'Renewal date',
  // },
  {
    id: "Action",
    label: "Action",
  },
];

function createData(
  skills: any,
  expertise: any,
  achieved: any,
  required: any,
  attachment: any,
  modified: any,
  modifiedBy: any,
  // renewal_date: any,
  Action: any,
  searchableText: string,
) {
  return {
    skills,
    expertise,
    achieved,
    required,
    attachment,
    modified,
    modifiedBy,
    // renewal_date,
    Action,
    searchableText,
  };
}

function LayeredSkill({ skill, type, t }: any) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "5px",
      }}
    >
      <Typography className="smallBodyBold">{t(skill)}</Typography>
      <Typography
        className="smallBody"
        sx={{
          color: "#B3B3BF",
          fontStyle: "italic",
        }}
      >
        {t(type)}
      </Typography>
    </Box>
  );
}

function CellAction({ onEdit, onDelete }: any) {
  return (
    <Box className="action-icon-rounded">
      <Box onClick={onEdit}>
        <EditIcon />
      </Box>

      <Box onClick={onDelete}>
        <BinIcon />
      </Box>
    </Box>
  );
}

function AddAttachment({ url }: any) {
  if (!url) return " ";

  return (
    <Link
      to={url}
      // sx={{
      //   marginLeft: '9%',
      // }}

      style={{
        marginLeft: "9%",
      }}
    >
      <Attachment />
    </Link>
  );
}

function OpenAttachment({
  empSkillId,
  filePath,
  showMessage,
  setAttachment,
  setOpenAttachment,
  setFileType,
  setLoading,
}: any) {
  if (!filePath) return " ";

  const getMimeType = (extension: any) => {
    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return `image/${extension}`;
      case "pdf":
        return "application/pdf";
      default:
        return "application/octet-stream";
    }
  };

  const getSkillFile = () => {
    setLoading(true);
    setOpenAttachment(true);

    jwtInterceptor
      .get(
        "api/EmployeeSkill/DownloadSkillAttachment?EmployeeSkillId=" +
        empSkillId,
        { responseType: "blob" }
      )
      .then((response: any) => {
        if (response.status === 200) {
          let url = URL.createObjectURL(response.data);

          const ext = filePath
            .substring(filePath.lastIndexOf(".") + 1)
            .toLowerCase();
          const type = getMimeType(ext);

          if (type === "application/pdf") {
            const blob = new Blob([response.data], { type: "application/pdf" });
            url = URL.createObjectURL(blob) + "#toolbar=0";
          }

          setAttachment(url);
          setFileType(type);
        }
      })
      .catch((err: any) => {
        showMessage(err.message, "error");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box sx={{ px: "20%" }}>
      <div onClick={getSkillFile}>
        <Attachment />
      </div>
    </Box>
  );
}

const score = [
  "Unexperienced",
  "Novice",
  "Advanced beginner",
  "Competent",
  "Proficient",
  "Expert",
];

const initialState = {
  SkillConfigurationId: "",
  EmployeeDetailId: "",
  SkillAchievementId: "",
  SkillExpertiseId: "",
  RenewalDate: "",
  file: "",
};
const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "skills":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "serviceData":
      return {
        ...state,
        ...action.value,
      };
    case "error":
      return {
        ...state,
        error: action.value,
      };
    case "reset":
      return {
        ...state,
        error: [],
      };
    default:
      return state;
  }
};
function EmployeeSkillsTable() {
  const service = new SkillsService();
  const [open, setOpen] = useState<any>(false);
  const [deleteModal, setDeleteModal] = useState<any>(false);
  const [Achievement, setAchievement] = useState<any>(null);
  const [btnType, setbtnTypeState] = useState<any>();
  const [id, setIdState] = useState<any>(null);
  const [skillsList, setallSkillsListDataState] = useState<any>([]);
  const [experts, setallExpertsListDataState] = useState<any>([]);
  const [skills, dispatch] = useReducer(reducer, initialState);
  const [file, setFile] = useState<any>(null);
  const initialized = useRef(false);
  const { showMessage }: any = useSnackbar();
  const [attachment, setAttachment] = useState<any>(null);
  const [openAttachment, setOpenAttachment] = useState(false);
  const [fileType, setFileType] = useState<any>(null);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<any>('');
  const tblRows: any = [];
  const [skillsData, setSkillsDataState] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const bearerToken = sessionStorage.getItem("token_key");
  const empId: any = sessionStorage.getItem("empId_key");

  const navigate = useNavigate();
  const base_url = process.env.REACT_APP_BASE_URL;

  const GetSkillsConfigurationListData = async () => {
    setLoading(true);

    jwtInterceptor
      .get("api/SkillConfiguration/GetSkillConfigurationList")
      .then((response: any) => {
        let allSkills = [];
        for (var x of response.data) {
          let item = {
            skillConfigurationId: x.skillConfigurationId,
            skill: x.skill,
          };
          allSkills.push(item);
        }
        setallSkillsListDataState(allSkills);
      })
      .catch((err: any) => {
        showMessage(err.message, "error");
      })
      .finally(() => setLoading(false));
  };

  const GetSkillsExpertsConfigurationListData = async () => {
    setLoading(true);

    jwtInterceptor
      .get("api/SkillConfiguration/GetSkillExpertiseList")
      .then((response: any) => {
        let allExperties = [];
        for (var x of response.data) {
          let item = {
            skillExpertiseId: x.skillExpertiseId,
            expertise: x.expertise,
          };
          allExperties.push(item);
        }

        setallExpertsListDataState(allExperties);
      })
      .catch((err: any) => {
        showMessage(err.message, "error");
      })
      .finally(() => setLoading(false));
  };

  const GetSkillsListData = async () => {
    setLoading(true);

    jwtInterceptor
      .get(
        "api/EmployeeSkill/GetSkillDashboardByEmployeeDetailId?EmployeeDetailId=" +
        empId
      )
      .then((response: any) => {
        for (var x of response.data) {
          let eId = x.employeeSkillId;
          let item = x;

          const skillText = x.skill;
          const expertiseText = x.expertise;
          const achievedScoreText = x.achievedScore.toString();
          const requiredScoreText = x.requiredScore.toString();
          const modifiedDateText = x?.modifiedDate?.split("T")[0] || '';
          const modifiedByText = x?.modifiedBy || '';

          // Combine all text for searchable text
          const searchableText = [
            skillText,
            expertiseText,
            achievedScoreText,
            requiredScoreText,
            modifiedDateText,
            modifiedByText,
          ].join(' ');
          
          tblRows.push(
            createData(
              LayeredSkill({ skill: x.skill, type: x.skillType, t }),
              <RoundedChip
                employee={true}
                status={x.expertise}
                color="#27AE60"
                agendaColor={x.agendaColor}
              />,
              <CircularChip value={x.achievedScore} color="#18A0FB" />,
              <CircularChip value={x.requiredScore} color="#18A0FB" />,
              // <AddAttachment url={x.blobFilePath} />,
              <OpenAttachment
                empSkillId={eId}
                filePath={x.blobFilePath}
                showMessage={showMessage}
                setAttachment={setAttachment}
                setOpenAttachment={setOpenAttachment}
                setFileType={setFileType}
                setLoading={setLoading}
              />,
              <Box>{x?.modifiedDate?.split("T")[0]}</Box>,
              <Box>{x?.modifiedBy}</Box>,
              // x.renewalDate
              //   ? new Date(x.renewalDate).toLocaleDateString('en-GB')
              //   : '',
              <CellAction
                id={x.employeeSkillId}
                onEdit={() => {
                  onEdit("Edit", item);
                }}
                onDelete={() => onDelete(eId)}
              />,
              searchableText,
            )
          );
        }
        setSkillsDataState(tblRows);
        setLoading(false);
      })
      .catch((err: any) => {
        showMessage(err.message, "error");
      })
      .finally(() => setLoading(false));
  };

  const deleteSkillset = async () => {
    //const response = await service.deleteSkillRequest(id);
    let url = "api/EmployeeSkill/DeleteEmployeeSkills?EmployeeSkillId=" + id;
    jwtInterceptor
      .delete(url)
      .then((response: any) => {
        showMessage(response.data, "success");
        GetSkillsListData();
      })
      .catch((err: any) => {
        showMessage(err.message, "error");
      });
  };

  function onEdit(from: any, item: any) {
    item?.renewalDate != null
      ? setSelectedDate(dayjs(item?.renewalDate))
      : setSelectedDate('');
    setOpen((pre: any) => !pre);
    setbtnTypeState(from);
    setIdState(item.employeeSkillId);
    setSelectedItem(item);
    setAchievement(item.achievedScore);
  }
  function onDelete(eId: any) {
    setDeleteModal((pre: any) => !pre);
    setIdState(eId);
  }
  function onConfirmationDelete() {
    setDeleteModal((pre: any) => !pre);
    deleteSkillset();
  }
  const inputChange = (e: any) => {
    const val = e.target.value;
    const name = e.target.name;

    setSelectedItem({
      ...selectedItem,
      [name.charAt(0).toLowerCase() + name.slice(1)]: val,
    });

    dispatch({
      type: "skills",
      field: name,
      value: val,
    });
  };
  const inputDateChange = (e: any) => {
    const val = e.$d.toISOString();
    const name = "RenewalDate";
    setSelectedDate(dayjs(val));
    setSelectedItem({
      ...selectedItem,
      [name.charAt(0).toLowerCase() + name.slice(1)]: val,
    });
    dispatch({
      type: "skills",
      field: name,
      value: val,
    });
  };

  const setFileInformation = (file: any) => {
    setFile(file);
  };
  const closeModal = () => {
    setFilesName(null);
    setOpen(false);
    setbtnTypeState("");
    setSelectedItem(null);
    setAchievement(null);
    setSelectedDate('');
    setIdState(null);
    setFile(null);
  };

  const onSkillSave = async () => {
    const formData = new FormData();
    formData.append("file", file);
    // formData.append("name", name); filename is not required at any of the place
    formData.append("SkillConfigurationId", selectedItem?.skillConfigurationId);
    formData.append("EmployeeDetailId", empId);
    formData.append("SkillAchievementId", Achievement);
    formData.append("SkillExpertiseId", selectedItem?.skillExpertiseId);
    formData.append("RenewalDate", selectedDate);

    if (id !== null) {
      formData.append("EmployeeSkillId", id);
    }

    if (skills.SkillConfigurationId != "" && Achievement) {

      if (selectedDate === '' && ((selectedItem?.blobFilePath ?? file) !== null)) {
        showMessage("Renewal Date is Mandatory with Attachment", "error");
        return;
      } else if (((selectedItem?.blobFilePath ?? file) === null) && selectedDate !== '') {
        showMessage("Attachment is Mandatory with Renewal Date", "error");
        return;
      }

      let url =
        id === null
          ? "EmployeeSkill/CreateEmployeeSkills"
          : "EmployeeSkill/UpdateEmployeeSkills";
      let response = await service.createNewSkillRequest(
        url,
        formData,
        bearerToken
      );
      if (response.status === 200) {
        showMessage(response.data, "success");
        GetSkillsListData();
      } else {
        showMessage(response.data, "error");
      }

      /* jwtInterceptor
        .post(url, formData)
        .then((response) => {
          showMessage(response.data, "success");
          GetSkillsListData();
        })
        .catch((err) => {
          showMessage(err.message, "error");
        });*/

      closeModal();
    } else {
      showMessage("Select Skill and Achievement values", "error");
    }
  };

  const renderContent = () => {
    if (!attachment) return null;

    if (fileType?.startsWith("image/")) {
      return (
        <img
          src={attachment}
          alt="Attachment"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      );
    } else if (fileType === "application/pdf") {
      return (
        <object
          data={attachment}
          type="application/pdf"
          width="100%"
          height="700px"
        />
      );
    } else {
      return (
        <object data={attachment} type={fileType} width="100%" height="700px">
          <p>Unable to preview file.</p>
        </object>
      );
    }
  };

  useEffect(() => {
    if (!initialized.current) {
      if (bearerToken) {
        initialized.current = true;
        GetSkillsListData();
        GetSkillsConfigurationListData();
        GetSkillsExpertsConfigurationListData();
      } else {
        window.location.href = base_url + "/login";
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { t, i18n } = useTranslation();

  const [filesName, setFilesName] = useState<any>(null);

  return (
    <>
      <EnhancedTable
        head={headCells}
        rows={skillsData}
        isAddable={true}
        onAddClick={() => setOpen((pre: any) => !pre)}
        loading={loading}
        title={t("Employee Skills")}
        btnTitle="New Skill"
      />

      <BaseModal
        open={open}
        handleClose={closeModal}
        onSave={onSkillSave}
        title={`Skill Management - ${btnType === "Edit" ? "Edit Skill" : "New Skill"
          }`}
      >
        <Grid
          container
          spacing="20px"
          sx={{
            overflowX: "hidden",
          }}
        >
          <Grid item xs={12} sm={6}>
            <Typography className="SmallBody" fontWeight={500}>
              {t("Skill")}
            </Typography>

            <Select
              variant="outlined"
              placeholder={t("Select Skill")}
              name="SkillConfigurationId"
              value={`${skillsList?.find((item: any) => {
                return (
                  item?.skillConfigurationId ===
                  selectedItem?.skillConfigurationId
                );
              })?.skill || ""
                }`}
              onChange={(e: any) => {
                inputChange(e);
              }}
              sx={{
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": {
                  border: 0,
                },
                borderRadius: "10px",
              }}
            >
              <MenuItem disabled value="">
                <em>{t("Expertise")}</em>
              </MenuItem>

              {skillsList.map((item: any, i: any) => (
                <MenuItem value={item.skillConfigurationId} key={i}>
                  {t(item.skill)}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography className="SmallBody" fontWeight={500}>
              {t("Expertise")}
            </Typography>

            <Select
              variant="outlined"
              style={{
                background: "transparent",
                outline: "none",
              }}
              value={`${experts?.find((item: any) => {
                return (
                  item?.skillExpertiseId === selectedItem?.skillExpertiseId
                );
              })?.expertise || ""
                }`}
              placeholder={t("Select Expertise")}
              name="SkillExpertiseId"
              onChange={(e: any) => {
                inputChange(e);
              }}
              sx={{
                borderRadius: "10px",
              }}
            >
              <MenuItem disabled value="">
                <em>{t("Expertise")}</em>
              </MenuItem>
              {experts.map((item: any, i: any) => (
                <MenuItem value={item.skillExpertiseId} key={i}>
                  {t(item.expertise)}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography className="SmallBody" fontWeight={500}>
              {t("Achievement Score")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: "8px",
                mt: "10px",
              }}
            >
              {[...Array(6)].map((_, num) => (
                <ToggleButton
                  value={""}
                  selected={num === Achievement}
                  style={{
                    color: "black",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    backgroundColor:
                      num === Achievement ? "#D3ECFF" : "transparent",
                  }}
                  onClick={() => setAchievement(num)}
                >
                  {num}
                </ToggleButton>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography className="SmallBody" fontWeight={500}>
              {t("Renewel Date")}
            </Typography>

            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={i18n.language}
            >
              <DatePicker
                slots={{
                  openPickerIcon: CalendarIcon,
                }}
                sx={{
                  ".MuiOutlinedInput-notchedOutline": {
                    border: 0,
                  },
                  borderRadius: "10px",
                }}
                value={selectedDate}
                onChange={inputDateChange}
                format="DD/MM/YYYY"
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography className="SmallBody" fontWeight={500}>
              {t("Score")}
            </Typography>
            <Box
              sx={{
                mt: "10px",
              }}
            >
              {[...Array(6)].map((_, num) => (
                <span
                  key={num}
                  style={{ display: "block", textTransform: "capitalize" }}
                >
                  {num} {t(score[num])}
                </span>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography className="SmallBody" fontWeight={500}>
              {t("Attachments")}
            </Typography>
            <br />

            <DragAndDrop
              edit={true}
              onChangeFile={(e: any) => setFileInformation(e.target.files[0])}
              setFilesName={setFilesName}
              sx={{
                minHeight: "170px",
                maxWidth: "234px",
                mx: "auto",
              }}
            />
          </Grid>
          {filesName ? (
            <Grid item sx={{ display: "flex", columnGap: "16px" }}>
              <FileIcon />
              <Typography variant="body1">{filesName}</Typography>
            </Grid>
          ) : selectedItem?.blobFilePath && (
            <Grid item sx={{ display: "flex", columnGap: "16px" }}>
              <FileIcon />
              <Typography variant="body1">{selectedItem.blobFilePath}</Typography>
            </Grid>
          )}
        </Grid>
      </BaseModal>

      <DeleteModal
        open={deleteModal}
        onCancel={() => setDeleteModal((pre: any) => !pre)}
        title=""
        description="Do you want to delete the registered skill ?"
        onConfirm={() => onConfirmationDelete()}
      />

      <BaseModal
        open={openAttachment}
        handleClose={() => {
          setOpenAttachment(false);
          setAttachment(null);
          setFileType(null);
        }}
        showSaveButton={false}
        title={'Attachment Preview'}
      >
        {!loading ? (
          attachment && <Grid container mt={2}>{renderContent()}</Grid>
        ) : (
          <Grid
            container
            justifyContent="center"
            minHeight="50px"
          >
            <CircularProgress />
          </Grid>
        )}
      </BaseModal>
    </>
  );
}

export default EmployeeSkillsTable;
