import React, { Component, ChangeEvent } from "react";
import UploadService from "../../services/upload-files.service";
import DragAndDrop from "../Global/DragAndDrop";
import { Button } from "@mui/material";

interface UploadFilesState {
  selectedFiles: FileList | undefined;
  progressInfos: { percentage: number; fileName: string }[];
  message: string[];
  fileInfos: any[]; // adjust the type according to your data structure
}

interface UploadFilesProps {
  path: string; // assuming path is a string
  t: any;
}

export default class UploadFiles extends Component<
  UploadFilesProps,
  UploadFilesState
> {
  constructor(props: UploadFilesProps) {
    super(props);
    this.state = {
      selectedFiles: undefined,
      progressInfos: [],
      message: [],
      fileInfos: [],
    };
    this.selectFiles = this.selectFiles.bind(this);
    this.upload = this.upload.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
  }

  componentDidMount() {
    // You may uncomment this if needed
    // UploadService.getFiles().then((response) => {
    //   this.setState({
    //     fileInfos: response.data,
    //   });
    // });
  }

  selectFiles(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      this.setState({
        progressInfos: [],
        selectedFiles: selectedFiles,
      });
    }
  }

  upload(idx: number, file: File) {
    const { progressInfos } = this.state;
    let _progressInfos = [...progressInfos];

    UploadService.upload(this.props.path, file, (event: ProgressEvent) => {
      if (event.lengthComputable) {
        _progressInfos[idx].percentage = Math.round(
          (100 * event.loaded) / event.total
        );
        this.setState({
          progressInfos: _progressInfos,
        });
      }
    })
      .then((response) => {
        console.log("Hi");
        console.log(response);
        this.setState((prev) => {
          let nextMessage = [
            ...prev.message,
            "Uploaded the file successfully: " + file.name,
          ];
          return {
            message: nextMessage,
          };
        });

        //return UploadService.getFiles();
      })
      .then(() => {
        // this.setState({
        //   fileInfos: files.data,
        // });
      })
      .catch((e) => {
        console.log(e);
        _progressInfos[idx].percentage = 0;
        this.setState((prev) => {
          let nextMessage = [
            ...prev.message,
            "Could not upload the file: " + file.name,
          ];
          return {
            progressInfos: _progressInfos,
            message: nextMessage,
          };
        });
      });
  }

  uploadFiles() {
    const { selectedFiles } = this.state;

    if (selectedFiles) {
      let _progressInfos = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        _progressInfos.push({ percentage: 0, fileName: selectedFiles[i].name });
      }

      this.setState(
        {
          progressInfos: _progressInfos,
          message: [],
        },
        () => {
          for (let i = 0; i < selectedFiles.length; i++) {
            this.upload(i, selectedFiles[i]);
          }
        }
      );
    }
  }

  render() {
    const { selectedFiles, progressInfos, message }: UploadFilesState =
      this.state;
    const { t } = this.props;
    return (
      <div>
        {progressInfos.map((progressInfo, index) => (
            <div className="mb-2" key={index}>
              <span>{progressInfo.fileName}</span>
              {/* <div className="progress">
                <div
                  className="progress-bar progress-bar-info"
                  role="progressbar"
                  aria-valuenow={progressInfo.percentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{ width: progressInfo.percentage + "%" }}
                >
                  {progressInfo.percentage}%
                </div>
              </div> */}
            </div>
          ))}

        <div className="row my-3">
          <div className="col-8">
            <DragAndDrop
              type="file"
              allowMultiple
              onChangeFile={this.selectFiles}
              sx={{
                margin: "40px auto",
              }}
            />
          </div>

          <div className="col-4">
            <Button
              disabled={!selectedFiles}
              onClick={this.uploadFiles}
              variant="contained"
              size="medium"
              sx={{ width: "70%", mt: 3 }}
            >
              {<span>{t("Upload")}</span>}
            </Button>
          </div>
        </div>

        {message.length > 0 && (
          <div className="alert alert-secondary" role="alert">
            <ul>
              {message.map((item, i) => {
                return <li key={i}>{item}</li>;
              })}
            </ul>
          </div>
        )}
      </div>
    );
  }
}
