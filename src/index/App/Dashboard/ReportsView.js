import React from "react";
import "../shared/ReportsView.css";
import {
  Spinner,
  Table,
  Nav,
  Dropdown,
  DropdownButton,
  Modal,
  Form,
  Button,
} from "react-bootstrap";

import excel from "../shared/excelicon.png";
import axios from "axios";
import "react-dropzone-uploader/dist/styles.css";
import { categories } from "../shared/lib/categories";
import XLSX from "xlsx";
import { SheetJSFT } from "./types";
import _CONFIG from "../../../config/config";
import { compareStrings, trimLower } from "../shared/lib/util";
import DetailsModal from "../components/DetailsModal";
import Search from "../components/Search";
import ImportFileModal from "../components/ImportFileModal";
import DeleteModal from "../components/DeleteModal";
import CommentTenderModal from "../components/CommentTenderModal";
import TableComponent from "../components/TableComponent";

export default class ReportsView extends React.Component {
  state = {
    searchInput: "",
    editSave: "none",
    users: [],
    isLoaded: false,
    commentModal: "none",
    emailModal: "none",
    individualEmailModule: "none",
    reports: [],
    importFileModal: "none",
    exportFileModal: "none",
    editReportModal: "none",
    addModalDisplay: "none",
    importBtnClicked: 0,
    exportbtnClicked: 0,
    saveBtnClicked: 0,
    editBtnClicked: 0,
    emailBtnClicked: 0,
    addBtnClicked: 0,
    deleteBtnClicked: false,
    industryBtnClicked: false,
    commentBtnClicked: false,
    editFieldID: "",
    editFieldIndex: 0,
    deleteModalDisplay: "none",
    chosenUser: "User",
    chosenIndustry: "Industry",
    selectedFile: null,
    chosenProject: "Project",
    file: {},
    data: [],
    cols: [],
    subSector: "",
    industry: "Industry",
    projects: [],
    projectName: "Project",
    categoryModal: "none",
    industries: [],
    determinedIndustry: "",
    defaultReports: [],
    industryFilterClicked: 0,
    projectFilterClicked: 0,
    userFilterClicked: 0,
    status: "Status",
    viewBtn: "View",
    show: false,
    tableTheme: 'light',
    userDetails: {
      id: "",
      industry: "",
      organisation: "",
      website: "",
      contacts: "",
      contactPerson: "",
      telephone: "",
      designation: "",
      emailAddress: "",
      physicalLocation: "",
      projectName: "",
      status: false,
      collectionTime: "",
      submittedBy: "",
      comments: null,
    },
  };

  componentDidMount() {
    axios
      .get(_CONFIG.API_URI + "/api/v1/admin/get_reports", {
        headers: {
          "auth-token": `${localStorage.getItem("auth-token")}`,
        },
      })
      .then((res) => {
        this.setState({
          isLoaded: true,
          reports: res.data,
          defaultReports: res.data.reverse(),
        });
      })
      .catch((err) => console.log(err));

    axios
      .get(_CONFIG.API_URI + "/api/v1/admin/get_industries", {
        headers: {
          "auth-token": `${localStorage.getItem("auth-token")}`,
        },
      })
      .then((res) => {
        this.setState({
          industries: res.data,
        });
      });

    axios
      .get(_CONFIG.API_URI + "/api/v1/admin/get_users", {
        headers: {
          "auth-token": `${localStorage.getItem("auth-token")}`,
        },
      })
      .then((res) => {
        this.setState({
          users: res.data,
        });
      })
      .catch((err) => {
        console.log("error getting users" + err);
      });

    axios
      .get(_CONFIG.API_URI + "/api/v1/admin/get_projects", {
        headers: {
          "auth-token": `${localStorage.getItem("auth-token")}`,
        },
      })
      .then((res) => {
        this.setState({
          projects: res.data,
        });
      })
      .catch((err) => {
        console.log("error getting users" + err);
      });

    localStorage.setItem("page", "database");
  }

  handleDetailModal = ({
    id,
    industry,
    organisation,
    website,
    contacts,
    contactPerson,
    telephone,
    designation,
    emailAddress,
    physicalLocation,
    projectName,
    status,
    collectionTime,
    submittedBy,
    comments,
  }) => {
    this.setState({
      show: this.state.show ? false : true,
      userDetails: {
        id: id,
        industry: industry,
        organisation: organisation,
        website: website,
        contacts: contacts,
        contactPerson: contactPerson,
        telephone: telephone,
        designation: designation,
        emailAddress: emailAddress,
        physicalLocation: physicalLocation,
        projectName: projectName,
        status: status,
        collectionTime: collectionTime,
        submittedBy: submittedBy,
        comments: comments,
      },
    });
  };

  onEditClick = () => {
    this.setState(
      {
        navigation: "edit",
      },
      () => {
        this.toggleSave();
      }
    );
  };

  toggleEmailModalDisplay = () => {
    this.state.emailModal === "none"
      ? this.setState({ emailModal: "block" })
      : this.setState({ emailModal: "none" });
  };

  toggleIndividualEmailModalDisplay = () => {
    this.state.individualEmailModule === "none"
      ? this.setState({ individualEmailModule: "block" })
      : this.setState({ individualEmailModule: "none" });
  };

  toggleImportModalDisplay = () => {
    this.state.importFileModal === "none"
      ? this.setState({ importFileModal: "block" })
      : this.setState({ importFileModal: "none", importBtnClicked: 0 });
  };

  toggleExportModalDisplay = () => {
    this.state.exportFileModal === "none"
      ? this.setState({ exportFileModal: "block" })
      : this.setState({ exportFileModal: "none", exportbtnClicked: 0 });
  };

  toggleEditModalDisplay = () => {
    this.state.editReportModal === "none"
      ? this.setState({ editReportModal: "block" })
      : this.setState({ editReportModal: "none" });
  };

  toggleIndstryModalDisplay = () => {
    this.state.categoryModal === "none"
      ? this.setState({ categoryModal: "block" })
      : this.setState({ categoryModal: "none" });
  };

  toggleAddModalDisplay = () => {
    this.state.addModalDisplay === "none"
      ? this.setState({ addModalDisplay: "block" })
      : this.setState({ addModalDisplay: "none" });
  };

  toggleDeleteModal = () => {
    this.state.deleteModalDisplay === "none"
      ? this.setState({ deleteModalDisplay: "block" })
      : this.setState({ deleteModalDisplay: "none" });
  };

  toggleCommentModalDisplay = () => {
    this.state.commentModal === "none"
      ? this.setState({ commentModal: "block" })
      : this.setState({ commentModal: "none" });
  };

  getEditField = (id) => {
    return this.state.reports.filter((report) => report._id === id);
  };

  saveEditedFied = async (id) => {
    this.setState({
      editBtnClicked: 1,
    });
    try {
      const saveEdits = {
        organisation:
          document.getElementById("organisation").value.length < 1
            ? document
                .getElementById("organisation")
                .getAttribute("placeholder")
            : document.getElementById("organisation").value,
        website:
          document.getElementById("website").value.length < 1
            ? document.getElementById("website").getAttribute("placeholder")
            : document.getElementById("website").value,
        contacts:
          document.getElementById("contacts").value.length < 1
            ? document
                .getElementById("organisation")
                .getAttribute("placeholder")
            : document.getElementById("organisation").value,
        contactPerson:
          document.getElementById("contactPerson").value.length < 1
            ? document
                .getElementById("contactPerson")
                .getAttribute("placeholder")
            : document.getElementById("contactPerson").value,
        telephone:
          document.getElementById("telephone").value.length < 1
            ? document.getElementById("telephone").getAttribute("placeholder")
            : document.getElementById("telephone").value,
        designation:
          document.getElementById("designation").value.length < 1
            ? document.getElementById("designation").getAttribute("placeholder")
            : document.getElementById("designation").value,
        emailAddress:
          document.getElementById("emailAddress").value.length < 1
            ? document
                .getElementById("emailAddress")
                .getAttribute("placeholder")
            : document.getElementById("emailAddress").value,
        physicalLocation:
          document.getElementById("physicalLocation").value.length < 1
            ? document
                .getElementById("physicalLocation")
                .getAttribute("placeholder")
            : document.getElementById("physicalLocation").value,
        industry:
          trimLower(this.state.chosenIndustry) === trimLower("Industry")
            ? document
                .getElementsByName("industryEdit")[0]
                .getAttribute("title")
            : this.state.chosenIndustry,
        projectName:
          trimLower(this.state.chosenProject) === trimLower("Project")
            ? document.getElementsByName("editproject")[0].getAttribute("title")
            : this.state.chosenProject,
      };

      axios
        .post(`${_CONFIG.API_URI}/api/v1/admin/edit_record/${id}`, saveEdits, {
          headers: {
            "auth-token": `${localStorage.getItem("auth-token")}`,
          },
        })
        .then((res) => {
          alert("Succesfully saved your changes");
          console.log(res);
          this.toggleEditModalDisplay();
          this.reloadPage();
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  };

  addComment = async (id) => {
    try {
      const comments = await document.getElementById("comment-field").value;
      // added comments
      axios
        .post(
          `${_CONFIG.API_URI}/api/v1/admin/edit_record/${id}`,
          { comments: comments },
          {
            headers: {
              "auth-token": `${localStorage.getItem("auth-token")}`,
            },
          }
        )
        .then((res) => {
          alert("Succesfully added comment");
          console.log(res);
          this.toggleCommentModalDisplay();
          this.reloadPage();
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  };

  getAddEntryFormValues = async () => {
    return {
      projectName:
        this.state.projectName === "Project" ? "" : this.state.projectName,
      organization: document.getElementsByName("organisation")[0].value,
      website: document.getElementsByName("website")[0].value,
      contacts: document.getElementsByName("contacts")[0].value,
      contactPerson: document.getElementsByName("contactPerson")[0].value,
      telephone: document.getElementsByName("telephone")[0].value,
      designation: document.getElementsByName("designation")[0].value,
      emailAddress: document.getElementsByName("emailAddress")[0].value,
      physicalLocation: document.getElementsByName("physicalLocation")[0].value,
      industry:
        this.state.chosenIndustry === "Industry"
          ? ""
          : this.state.chosenIndustry,
      comments: document.getElementsByName("comments")[0].value,
      submittedBy: "admin",
    };
  };

  resetFirst = (callback) => {
    this.setState(
      {
        reports: this.state.defaultReports,
      },
      () => {
        callback();
      }
    );
  };

  addReport = async (savedReport) => {
    const toSave = await savedReport;
    try {
      axios
        .post(_CONFIG.API_URI + "/api/v1/admin/add_record", toSave, {
          "Content-Type": "application/json;charset=UTF-8",
          headers: {
            "auth-token": `${localStorage.getItem("auth-token")}`,
          },
        })
        .then((res) => {
          alert("succesfully added " + res);
          this.setState({
            addBtnClicked: 0,
          });
          this.toggleAddModalDisplay();
          this.reloadPage();
        })
        .catch((err) => {
          console.log(err);
          document.getElementById("warning").value = err;
        });
    } catch (err) {
      console.log("error" + err);
    }
  };

  removeUser = async (id) => {
    try {
      axios
        .delete(_CONFIG.API_URI + "/api/v1/admin/delete_record/" + id, {
          headers: {
            "auth-token": `${localStorage.getItem("auth-token")}`,
          },
        })
        .then((res) => {
          console.log("succesfully deleted record " + res);
          alert("Succesfully deleted record");
          this.toggleDeleteModal();
          this.reloadPage();
        });
    } catch (err) {
      console.log("sorry " + err);
    }
  };

  reloadPage = () => {
    window.location.reload();
  };

  downloadExcel = () => {
    this.setState({
      exportbtnClicked: 1,
    });
    axios
      .post(_CONFIG.API_URI + "/api/v1/export_excel", this.state.reports, {
        headers: {
          "auth-token": `${localStorage.getItem("auth-token")}`,
        },
        responseType: "blob", // important
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "database.xlsx"); //or any other extension
        document.body.appendChild(link);
        link.click();
        this.setState({
          exportbtnClicked: 0,
        });
        this.toggleExportModalDisplay();
      })
      .catch((err) => {
        console.log("oops: " + err);
      });
  };

  handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) this.setState({ file: files[0] });
  };

  handleFile = async () => {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {
        type: rABS ? "binary" : "array",
        bookVBA: true,
      });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws);
      /* Update state */

      this.setState(
        {
          data: data,
        },
        () => {
          var dataArr = [];
          console.log(this.state.data.length);
          this.state.data
            .filter(
              (imports) =>
                typeof imports["ORGANISATION"] === "undefined" ||
                typeof imports["Organisation"] === "undefined" ||
                typeof imports["Organization"] === "undefined" ||
                typeof imports["ORGANIZATION"] === "undefined"
            )
            .forEach((imports, index) => {
              let dataObj = {
                organization:
                  imports["ORGANISATION"] ||
                  imports["Organisation"] ||
                  imports["Organization"] ||
                  imports["ORGANIZATION"],
                website: imports["WEBSITE "] || imports["Website"],
                contacts:
                  imports["CONTACTS"] ||
                  imports["Contacts"] ||
                  imports["Contact"] ||
                  imports["CONTACT"],
                contactPerson:
                  imports["CONTACT PERSON"] || imports["Contact Person"],
                telephone: imports["TELEPHONE"] || imports["Telephone"],
                designation: imports["DESIGNATION"] || imports["Desgination"],
                emailAddress:
                  imports["EMAIL ADDRESS"] ||
                  imports["Email"] ||
                  imports["Email Address"] ||
                  imports["EMAIL"],
                physicalLocation:
                  imports["PHYSICAL LOCATION"] ||
                  imports["Physical Location"] ||
                  imports["Physical Address"] ||
                  imports["PHYSICAL ADDRESS"],
                industry: imports["INDUSTRY"] || imports["Industry"],
                collectionDate: new Date().toUTCString(),
                collectionTime: new Date().toUTCString(),
                submittedBy: this.props.userLoggedIn,
              };
              dataArr.push(dataObj);
            });
          console.log(dataArr);
          for (let dataOb of dataArr) {
            try {
              fetch(_CONFIG.API_URI + "/api/v1/admin/add_record", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "auth-token": `${localStorage.getItem("auth-token")}`,
                },
                body: JSON.stringify(dataOb),
              })
                .then((response) => response.json())
                .then((dat) => {
                  console.log("Success uploaded record:", dat);
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
            } catch (err) {
              console.log(err);
              break;
            }
          }
          alert("Succesfully imported file data");
          this.reloadPage();
        }
      );
    };

    if (rABS) {
      reader.readAsBinaryString(this.state.file);
    } else {
      reader.readAsArrayBuffer(this.state.file);
    }
  };

  resetToDefault = async () => {
    if (
      this.state.chosenIndustry !== "Industry" ||
      this.state.projectName !== "Project" ||
      this.state.chosenUser !== "User"
    ) {
      this.setState({
        chosenIndustry: "Industry",
        projectName: "Project",
        chosenUser: "User",
        viewBtn: "View",
        reports: this.state.defaultReports,
      });
      return 0;
    }
    this.setState({
      reports: this.state.defaultReports,
    });
  };

  handleClose = () => {
    const { show } = this.state;
    this.setState({
      show: show ? false : true,
    });
  };

  handleSearch = (value) => {
    console.log(value);
    this.setState({
      searchInput: value,
    });
  };

  handleSearchInput = (category, input) => {
    this.setState({
      viewBtn: "Reset",
      reports: this.state.reports.filter(
        (report) =>
          trimLower(report.organization).includes(trimLower(input)) ||
          compareStrings(report.contactPerson, input) ||
          compareStrings(report.designation, input)
      ),
    });
  };

  handleCommentDisplay = (id) => {
    window.scrollTo(0, 0);
    this.setState({
      editFieldID: id,
    });
    this.toggleCommentModalDisplay();
  };

  handleEditDisplay = (id) => {
    window.scrollTo(0, 0);
    this.setState({
      editFieldID: id,
    });
    this.toggleEditModalDisplay();
  };

  handleDeleteDisplay = (id) => {
    window.scrollTo(0, 0);
    this.setState({
      editFieldID: id,
    });
    this.toggleDeleteModal();
  };

  render() {
    if (this.state.isLoaded) {
      const importLoadingBtn = (
        <Button variant="primary" disabled>
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          Importing...
        </Button>
      );

      const importBtn = (
        <Button
          variant="primary"
          onClick={() => {
            this.handleFile();
            this.setState({ importBtnClicked: 1 });
          }}
        >
          Import
        </Button>
      );

      const exportBtn = (
        <Button
          variant="primary"
          onClick={() => {
            this.downloadExcel();

            // then(res => {

            //     console.log(res)
            //     alert('Succesfully downloaded excel file');
            //     this.setState({ exportbtnClicked: 1 })
            //     this.toggleExportModalDisplay();
            // })
          }}
        >
          Export
        </Button>
      );
      const exportLoadingBtn = (
        <Button variant="primary" disabled>
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          Exporting...
        </Button>
      );

      const saveLoadingBtn = (
        <Button variant="primary" disabled>
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          Saving...
        </Button>
      );

      const saveBtn = (
        <Button
          variant="primary"
          onClick={() => {
            this.saveEditedFied(this.state.editFieldID);
          }}
        >
          Save
        </Button>
      );

      const addBtn = (
        <Button
          variant="primary"
          onClick={() => {
            this.setState({
              addBtnClicked: 1,
            });
            this.addReport(this.getAddEntryFormValues());
          }}
        >
          Add Entry
        </Button>
      );

      const addLoadingBtn = (
        <Button variant="primary" disabled>
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          Adding...
        </Button>
      );

      const deleteBtn = (
        <Button
          variant="primary"
          onClick={() => {
            this.setState({
              deleteBtnClicked: true,
            });
            this.removeUser(this.state.editFieldID);
          }}
        >
          Delete
        </Button>
      );

      const loadingDeleteBtn = (
        <Button variant="primary" disabled>
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          Deleting...
        </Button>
      );

      const industriesDB = this.state.industries.map((industry) => industry);
      const categoriesAndIndustries = [...categories, ...industriesDB];

      const status = ["confirmed", "pending"];

      return (
        <div>
          {/* details modal */}
          <DetailsModal
            handleComments={this.handleCommentDisplay}
            handleDelete={this.handleDeleteDisplay}
            show={this.state.show}
            handleClose={this.handleClose}
            handleEdits={this.handleEditDisplay}
            id={this.state.userDetails.id}
            industry={this.state.userDetails.industry}
            organisation={this.state.userDetails.organisation}
            website={this.state.userDetails.website}
            contacts={this.state.userDetails.contacts}
            contactPerson={this.state.userDetails.contactPerson}
            telephone={this.state.userDetails.telephone}
            designation={this.state.userDetails.designation}
            emailAddress={this.state.userDetails.emailAddress}
            physicalLocation={this.state.userDetails.physicalLocation}
            projectName={this.state.userDetails.projectName}
            status={this.state.userDetails.status}
            collectionTime={this.state.userDetails.collectionTime}
            submittedBy={this.state.userDetails.submittedBy}
            comments={this.state.userDetails.comments}
          />
          {/* delete modal */}
          <DeleteModal
            deleteModalDisplay={this.state.deleteModalDisplay}
            toggleDeleteModal={this.toggleDeleteModal}
            removeUser={this.removeUser}
            editFieldID={this.state.editFieldID}
          />

          {/* export file modal */}
          <div
            className="modal-bg"
            style={{
              display: this.state.exportFileModal,
            }}
          >
            <Modal.Dialog
              scrollable={true}
              className="modal-add-entry"
              style={{
                display: this.state.exportFileModal,
              }}
            >
              <Modal.Header>
                <Modal.Title>Export to Excel file</Modal.Title>
              </Modal.Header>

              <Modal.Body
                style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}
              >
                <b>Are you sure you want to export?</b>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={this.toggleExportModalDisplay}
                >
                  Cancel
                </Button>
                {this.state.exportbtnClicked < 1 ? exportBtn : exportLoadingBtn}
              </Modal.Footer>
            </Modal.Dialog>
          </div>

          {/* import file modal */}
          <ImportFileModal
            importFileModal={this.state.importFileModal}
            SheetJSFT={SheetJSFT}
            handleChange={this.handleChange}
            toggleImportModalDisplay={this.toggleImportModalDisplay}
            importBtnClicked={this.state.importBtnClicked}
            importBtn={importBtn}
            importLoadingBtn={importLoadingBtn}
          />
          {/* send email modal */}
          <div
            className="modal-bg"
            style={{
              display: this.state.emailModal,
            }}
          >
            <Modal.Dialog
              scrollable={true}
              className="modal-add-entry"
              style={{
                display: this.state.emailModal,
              }}
            >
              <Modal.Header>
                <Modal.Title>Send Bulk Email</Modal.Title>
              </Modal.Header>

              <Modal.Body
                style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}
              >
                <Form>
                  <Form.Group controlId="formRecipients">
                    <Form.Label>Recipients</Form.Label>

                    <div style={{ display: "flex" }}>
                      <DropdownButton
                        style={{ marginRight: "1rem" }}
                        variant="outline-secondary"
                        title="Industry"
                        id="input-group-dropdown-12"
                      >
                        {categories.map((category) => {
                          return (
                            <>
                              <DropdownButton
                                key={category.industry}
                                style={{ width: "70%", margin: "15px" }}
                                variant="outline-secondary"
                                title={category.industry}
                                id="input-group-dropdown-102"
                              ></DropdownButton>
                            </>
                          );
                        })}
                      </DropdownButton>

                      <DropdownButton
                        style={{ marginRight: "1rem" }}
                        variant="outline-secondary"
                        title={this.state.projectName}
                        id="input-group-dropdown-104"
                      >
                        {this.state.projects.map((project) => {
                          return (
                            <Dropdown.Item
                              key={project._id}
                              onClick={() => {
                                this.setState({
                                  projectName: project.projectName,
                                  reports: this.state.reports.filter(
                                    (report) =>
                                      report.projectName === project.projectName
                                  ),
                                });
                              }}
                            >
                              {project.projectName}
                            </Dropdown.Item>
                          );
                        })}
                      </DropdownButton>
                    </div>
                  </Form.Group>

                  <Form.Group controlId="formContactPerson">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                      type="textbox"
                      placeholder="e.g Welcome to B2B Africa"
                    />
                  </Form.Group>

                  <Form.Group controlId="formPosition">
                    <Form.Label>Body</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="4"
                      placeholder="Enter message..."
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={this.toggleEmailModalDisplay}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    this.setState({ emailBtnClicked: 1 });
                  }}
                >
                  {this.state.emailBtnClicked < 0 ? "Sending..." : "Send email"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </div>

          {/* edit report modal */}
          <div
            className="modal-bg"
            style={{
              display: this.state.editReportModal,
            }}
          >
            <Modal.Dialog
              scrollable={true}
              style={{
                display: this.state.editReportModal,
              }}
              className="modal-add-entry"
            >
              <Modal.Header>
                <Modal.Title>Edit Field</Modal.Title>
              </Modal.Header>

              <Modal.Body
                style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}
              >
                <Form id="edit-form">
                  <Form.Group controlId="formOrganisation">
                    <Form.Label>Organisation</Form.Label>
                    <Form.Control
                      id="organisation"
                      type="textbox"
                      placeholder={this.getEditField(
                        this.state.editFieldID
                      ).map((field) => field.organization)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formWebsite">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      id="website"
                      type="textbox"
                      placeholder={this.getEditField(
                        this.state.editFieldID
                      ).map((field) => field.website)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formContacts">
                    <Form.Label>Contacts</Form.Label>
                    <Form.Control
                      id="contacts"
                      type="textbox"
                      placeholder={this.getEditField(
                        this.state.editFieldID
                      ).map((field) => field.contacts)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formContactPerson">
                    <Form.Label>Contact Person</Form.Label>
                    <Form.Control
                      id="contactPerson"
                      type="textbox"
                      placeholder={this.getEditField(
                        this.state.editFieldID
                      ).map((field) => field.contactPerson)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formTelephone">
                    <Form.Label>Contact Telephone</Form.Label>
                    <Form.Control
                      id="telephone"
                      type="textbox"
                      placeholder={this.getEditField(
                        this.state.editFieldID
                      ).map((field) => field.telephone)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formDesignation">
                    <Form.Label>Designation</Form.Label>
                    <Form.Control
                      id="designation"
                      type="textbox"
                      placeholder={this.getEditField(
                        this.state.editFieldID
                      ).map((field) => field.designation)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formEmailAddress">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      id="emailAddress"
                      type="textbox"
                      placeholder={this.getEditField(
                        this.state.editFieldID
                      ).map((field) => field.emailAddress)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formPhysicalLocation">
                    <Form.Label>Physical Location</Form.Label>
                    <Form.Control
                      id="physicalLocation"
                      type="textbox"
                      placeholder={this.getEditField(
                        this.state.editFieldID
                      ).map((field) => field.physicalLocation)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formIndustry">
                    <Form.Label>Industry</Form.Label>
                    <DropdownButton
                      style={{ marginRight: "1rem" }}
                      variant="outline-secondary"
                      title={
                        trimLower(this.state.chosenIndustry) ===
                        trimLower("industry")
                          ? this.getEditField(this.state.editFieldID).map(
                              (field) => field.industry
                            )
                          : this.state.chosenIndustry
                      }
                      id="input-group-dropdown-12"
                      name="industryEdit"
                    >
                      {categoriesAndIndustries.map((industry) => {
                        return (
                          <Dropdown.Item
                            key={industry.industry}
                            onClick={() => {
                              this.setState({
                                chosenIndustry: industry.industry,
                              });
                            }}
                          >
                            {industry.industry}
                          </Dropdown.Item>
                        );
                      })}
                    </DropdownButton>
                  </Form.Group>
                  <Form.Group controlId="formEditProject">
                    <Form.Label>Project</Form.Label>
                    <DropdownButton
                      style={{ marginRight: "1rem" }}
                      variant="outline-secondary"
                      title={
                        trimLower(this.state.chosenProject) ===
                        trimLower("Project")
                          ? this.getEditField(this.state.editFieldID).map(
                              (field) => field.projectName
                            )
                          : this.state.chosenProject
                      }
                      id="input-group-dropdown-7"
                      name="editproject"
                    >
                      {this.state.projects.map((project, index) => {
                        return (
                          <Dropdown.Item
                            key={project._id}
                            className="projects-item"
                            onClick={() => {
                              this.setState({
                                chosenProject: project.projectName,
                              });
                            }}
                          >
                            {project.projectName}
                          </Dropdown.Item>
                        );
                      })}
                    </DropdownButton>
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={this.toggleEditModalDisplay}
                >
                  Cancel
                </Button>
                {this.state.editBtnClicked < 1 ? saveBtn : saveLoadingBtn}
              </Modal.Footer>
            </Modal.Dialog>
          </div>

          {/* add a report modal */}
          <div
            className="modal-bg"
            style={{
              display: this.state.addModalDisplay,
            }}
          >
            <Modal.Dialog
              scrollable={true}
              className="modal-add-entry"
              style={{
                display: this.state.addModalDisplay,
              }}
            >
              <Modal.Header>
                <Modal.Title>Record Entry</Modal.Title>
              </Modal.Header>

              <Modal.Body
                style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}
              >
                <Form id="add-form">
                  <Form.Group controlId="projects">
                    <Form.Label>Project</Form.Label>
                    <DropdownButton
                      style={{ marginRight: "1rem" }}
                      variant="outline-secondary"
                      title={this.state.projectName}
                      id="input-group-dropdown-7"
                      name="project"
                    >
                      {this.state.projects.map((project, index) => {
                        return (
                          <Dropdown.Item
                            key={project._id}
                            className="projects-item"
                            onClick={() => {
                              this.setState({
                                projectName: project.projectName,
                              });
                            }}
                          >
                            {project.projectName}
                          </Dropdown.Item>
                        );
                      })}
                    </DropdownButton>
                  </Form.Group>
                  <Form.Group controlId="formOrganization">
                    <Form.Label>Organisation</Form.Label>
                    <Form.Control
                      name="organisation"
                      type="textbox"
                      placeholder="Enter organisation"
                    />
                  </Form.Group>

                  <Form.Group controlId="formWebsite">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      name="website"
                      type="textbox"
                      placeholder="Enter website"
                    />
                  </Form.Group>

                  <Form.Group controlId="formContacts">
                    <Form.Label>Contacts</Form.Label>
                    <Form.Control
                      name="contacts"
                      type="textbox"
                      placeholder="07000000"
                    />
                  </Form.Group>

                  <Form.Group controlId="formContactPerson">
                    <Form.Label>Contact Person</Form.Label>
                    <Form.Control
                      name="contactPerson"
                      type="textbox"
                      placeholder="e.g Jane Doe"
                    />
                  </Form.Group>

                  <Form.Group controlId="telephone">
                    <Form.Label>Contact Telephone</Form.Label>
                    <Form.Control
                      name="telephone"
                      type="textbox"
                      placeholder="07000000"
                    />
                  </Form.Group>

                  <Form.Group controlId="designation">
                    <Form.Label>Designation</Form.Label>
                    <Form.Control
                      name="designation"
                      type="textbox"
                      placeholder="e.g CEO"
                    />
                  </Form.Group>

                  <Form.Group controlId="emailAddress">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      name="emailAddress"
                      type="email"
                      placeholder="example@example.com"
                    />
                  </Form.Group>

                  <Form.Group controlId="physicalLocation">
                    <Form.Label>Physical Location</Form.Label>
                    <Form.Control
                      name="physicalLocation"
                      type="textbox"
                      placeholder="Enter location"
                    />
                  </Form.Group>

                  <Form.Group controlId="industry">
                    <Form.Label>Industry</Form.Label>
                    <DropdownButton
                      style={{ marginRight: "1rem" }}
                      variant="outline-secondary"
                      title={this.state.chosenIndustry}
                      id="input-group-dropdown-2"
                      name="industry"
                    >
                      {categoriesAndIndustries.map((industry) => {
                        return (
                          <Dropdown.Item
                            key={industry.industry}
                            onClick={() => {
                              this.setState({
                                chosenIndustry: industry.industry,
                              });
                            }}
                          >
                            {industry.industry}
                          </Dropdown.Item>
                        );
                      })}
                    </DropdownButton>
                  </Form.Group>

                  <Form.Group controlId="comments">
                    <Form.Label>Comments</Form.Label>
                    <Form.Control
                      name="comments"
                      type="textbox"
                      placeholder="Enter comments"
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <small
                id="warning"
                style={{ color: "red", margin: "18px" }}
              ></small>
              <br />
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={this.toggleAddModalDisplay}
                >
                  Close
                </Button>
                {this.state.addBtnClicked < 1 ? addBtn : addLoadingBtn}
              </Modal.Footer>
            </Modal.Dialog>
          </div>

          {/* send individual email */}
          <div
            className="modal-bg"
            style={{
              display: this.state.individualEmailModule,
            }}
          >
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>Send Individual Email</Modal.Title>
              </Modal.Header>

              <Modal.Body
                style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}
              >
                <Form>
                  <Form.Group controlId="formContactPerson">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                      type="textbox"
                      placeholder="e.g Welcome to B2B Africa"
                    />
                  </Form.Group>

                  <Form.Group controlId="formPosition">
                    <Form.Label>Body</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="4"
                      placeholder="Enter message..."
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={this.toggleIndividualEmailModalDisplay}
                >
                  Cancel
                </Button>
                <Button variant="primary">Send Email</Button>
              </Modal.Footer>
            </Modal.Dialog>
          </div>

          {/* add comment to report modal*/}
          <CommentTenderModal
            commentModal={this.state.commentModal}
            data={this.state.reports}
            editFieldID={this.state.editFieldID}
            toggleCommentModalDisplay={this.toggleCommentModalDisplay}
            addComment={this.addComment}
          />

          {/* add a industry modal */}
          <div
            className="modal-bg"
            style={{
              display: this.state.categoryModal,
            }}
          >
            <Modal.Dialog
              scrollable={true}
              className="modal-add-entry"
              style={{
                display: this.state.categoryModal,
              }}
            >
              <Modal.Header>
                <Modal.Title>Add An Industry/Subsector</Modal.Title>
              </Modal.Header>

              <Modal.Body
                style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}
              >
                <Form>
                  <Form.Group controlId="formRecipients">
                    <Form.Label></Form.Label>
                  </Form.Group>

                  <Form.Group controlId="formIndustryName">
                    <Form.Label>Industry</Form.Label>
                    <Form.Control
                      className="industrysubsector"
                      type="textbox"
                      placeholder="e.g BANKING"
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => {
                    this.toggleIndstryModalDisplay();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    this.setState({
                      industryBtnClicked: true,
                    });
                    axios
                      .post(
                        _CONFIG.API_URI + "/api/v1/admin/add_industry",
                        {
                          industry:
                            document.getElementsByClassName(
                              "industrysubsector"
                            )[0].value,
                        },
                        {
                          headers: {
                            "auth-token": `${localStorage.getItem(
                              "auth-token"
                            )}`,
                          },
                        }
                      )
                      .then((res) => {
                        alert("Succesfully added an Industry" + res);
                        this.reloadPage();
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                >
                  {this.state.industryBtnClicked ? "Adding..." : "Add"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </div>

          <div className="container">
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontWeight: "bold" }}>
                Database{" "}
                <span style={{ fontSize: "18px" }}>
                  (Total: {this.state.reports.length} records)
                </span>
              </h2>
              <Search
                handleInput={this.handleSearch}
                searchInput={this.state.searchInput}
                handleSearchInput={this.handleSearchInput}
              />
            </div>
            <Nav
              variant="pills"
              defaultActiveKey="#"
              className="navigation-tab-menu"
            >
              <Nav.Item>
                <Nav.Link
                  href="#"
                  onClick={() => {
                    this.resetToDefault();
                  }}
                >
                  {this.state.viewBtn}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  onClick={this.toggleExportModalDisplay}
                  eventKey="link-1"
                >
                  Export
                  <img
                    src={excel}
                    alt="add"
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      borderRadius: "50%",
                      marginLeft: "5px",
                    }}
                  />
                </Nav.Link>
              </Nav.Item>

              <Nav.Item onClick={this.toggleEmailModalDisplay}>
                <Nav.Link eventKey="link-4">Send bulk email</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  href="#action"
                  onClick={() => {
                    this.toggleImportModalDisplay();
                  }}
                >
                  Import file
                  <img
                    src={excel}
                    alt="add"
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      borderRadius: "50%",
                      marginLeft: "5px",
                    }}
                  />
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link
                  href="#"
                  onClick={() => {
                    this.toggleAddModalDisplay();
                  }}
                >
                  Add entry
                </Nav.Link>
              </Nav.Item>

              <Nav.Item style={{ marginLeft: ".5rem" }}>
                <Nav.Link
                  href="#"
                  onClick={() => {
                    this.toggleIndstryModalDisplay();
                  }}
                >
                  Add Industry
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "2rem",
                  }}
                >
                  <span style={{ marginRight: "1rem" }}>Filter:</span>

                  {/* filter according to Confirmed*/}
                  <DropdownButton
                    style={{ marginRight: "1rem" }}
                    variant="outline-primary"
                    title={this.state.status}
                    id="input-group-dropdown-4"
                  >
                    {status.map((stat) => {
                      return (
                        <Dropdown.Item
                          onClick={() => {
                            if (stat === "confirmed") {
                              this.setState({
                                reports: this.state.reports.filter(
                                  (report) => report.confirmed
                                ),
                              });
                              return 0;
                            }
                            this.setState({
                              reports: this.state.reports.filter(
                                (report) => !report.confirmed
                              ),
                            });
                          }}
                        >
                          {stat}
                        </Dropdown.Item>
                      );
                    })}
                  </DropdownButton>
                  {/* filter according to sector and subsector */}
                  <DropdownButton
                    style={{ marginRight: "1rem", width: "100%" }}
                    variant="outline-primary"
                    title={this.state.chosenIndustry}
                    id="input-group-dropdown-2"
                  >
                    {categoriesAndIndustries.map((category) => {
                      return (
                        <>
                          <Dropdown.Item
                            key={category.industry}
                            onClick={() => {
                              this.resetFirst(() => {
                                this.setState({
                                  viewBtn: "Reset",
                                  chosenIndustry: category.industry,
                                  reports: this.state.reports.filter(
                                    (report) =>
                                      trimLower(report.industry) ===
                                      trimLower(category.industry)
                                  ),
                                });
                              });
                            }}
                            id="input-group-dropdown-3"
                          >
                            {category.industry}
                          </Dropdown.Item>
                        </>
                      );
                    })}
                  </DropdownButton>

                  {/* filter according to Project*/}
                  <DropdownButton
                    style={{ marginRight: "1rem" }}
                    variant="outline-primary"
                    title="Project"
                    id="input-group-dropdown-4"
                  >
                    {this.state.projects.map((project) => {
                      return (
                        <Dropdown.Item
                          key={project._id}
                          onClick={() => {
                            this.resetFirst(() => {
                              this.setState({
                                viewBtn: "Reset",
                                reports: this.state.reports.filter(
                                  (report) =>
                                    trimLower(report.projectName) ===
                                    trimLower(project.projectName)
                                ),
                              });
                            });
                          }}
                        >
                          {project.projectName}
                        </Dropdown.Item>
                      );
                    })}
                  </DropdownButton>
                  {/* filter according to user*/}
                  <DropdownButton
                    style={{ marginRight: "1rem" }}
                    variant="outline-primary"
                    title={this.state.chosenUser}
                    id="input-group-dropdown-5"
                  >
                    {this.state.users.map((user) => {
                      return (
                        <Dropdown.Item
                          key={user._id}
                          onClick={() => {
                            this.setState({
                              viewBtn: "Reset",
                              chosenUser: user.fullname,
                              reports: this.state.reports.filter(
                                (report) =>
                                  report.submittedBy.toLowerCase() ===
                                  user.username.toLowerCase()
                              ),
                            });
                          }}
                        >
                          {user.fullname}
                        </Dropdown.Item>
                      );
                    })}
                  </DropdownButton>
                </Nav.Link>
              </Nav.Item>

              {/* toggle table theme */}
              <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                    }}> 
                  <input
                   onChange={
                     ()=>{
                        document.body.classList.toggle('dark');
                            this.setState({tableTheme: this.state.tableTheme === 'light' ? 'dark' : 'light'})
                            }} type="checkbox" class="checkbox" id="checkbox" />
                  <label for="checkbox" class="label" >
                    <span class="fas fa-moon"></span>
                    <span class='fas fa-sun'></span>
                    <div class='ball'></div>
                  </label>    
              </div>

            </Nav>
            <section>
              <Table
                variant={this.state.tableTheme}
                className="reports-table table-responsive"
                style={{
                  marginTop: "30px",
                  overflow: "scroll",
                  maxHeight: "60vh",
                }}
                striped
                bordered
                hover
                responsive
              >
                <thead>
                  <tr variant="light">
                    <th>#</th>
                    <th>Industry</th>
                    <th>Organization</th>
                    <th>Website</th>
                    <th>Contacts</th>
                    <th>Contact person</th>
                    <th>Telephone</th>
                    <th>Designation</th>
                    <th>Email address</th>
                    <th>Physical location</th>
                    <th>Comments</th>
                    <th>Project</th>
                    <th>Status</th>
                    <th>Collection Time</th>
                    <th>Submitted by</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.reports.map((user, index) => {
                    return (
                      <>
                        <tr
                          key={index}
                          className="user-rows"
                          onClick={() => {
                            window.scrollTo(0, 0);
                            this.handleDetailModal({
                              id: user._id,
                              organisation: user.organization,
                              industry: user.industry,
                              website: user.website,
                              contacts: user.contacts,
                              contactPerson: user.contactPerson,
                              telephone: user.telephone,
                              designation: user.designation,
                              emailAddress: user.emailAddress,
                              physicalLocation: user.physicalLocation,
                              projectName: user.projectName,
                              status: user.status,
                              collectionTime: user.collectionTime,
                              submittedBy: user.submittedBy,
                              comments: user.comments,
                            });
                          }}
                        >
                          <td>{index + 1}</td>
                          <td> {user.industry}</td>
                          <td>{user.organization}</td>
                          <td> {user.website}</td>
                          <td>{user.contacts}</td>
                          <td>{user.contactPerson}</td>
                          <td>{user.telephone}</td>
                          <td>{user.designation}</td>
                          <td>{user.emailAddress}</td>
                          <td>{user.physicalLocation}</td>
                          <td>{user.comments}</td>
                          <td>{user.projectName}</td>
                          <td style={{ color: "yellow" }}>
                            {user.status ? "Confirmed" : "Pending"}
                          </td>
                          <td>{user.collectionTime}</td>
                          <td>{user.submittedBy}</td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </Table>
              {/* <TableComponent data={this.state.reports} /> */}
            </section>
          </div>
        </div>
      );
    }
    return (
      <div className="spinner-bg">
        <Spinner id="spinner" animation="grow" />
      </div>
    );
  }
}
