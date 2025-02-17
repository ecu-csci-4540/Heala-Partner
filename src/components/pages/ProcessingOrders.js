import React, { useState, useEffect } from "react";
import { Success } from "components/modals";
import { dateMoment, timeMoment } from "components/Utilities/Time";
import * as Yup from "yup";
import { useTheme } from "@mui/material/styles";
import { FormikControl } from "components/validation";
import { Formik, Form } from "formik";
import DisablePatient from "components/modals/DeleteOrDisable";
import {
  Grid,
  FormControl,
  FormLabel,
  Chip,
  Button,
  Checkbox,
  TableCell,
  TableRow,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  FormSelect,
  Modals,
  Search,
  Loader,
  CustomButton,
} from "components/Utilities";
import { EnhancedTable } from "components/layouts";
import { hcpsHeadCells } from "components/Utilities/tableHeaders";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useActions } from "components/hooks/useActions";
import { handleSelectedRows } from "helpers/selectedRows";
import { isSelected } from "helpers/isSelected";
import useFormInput from "components/hooks/useFormInput";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  changeTableLimit,
  handlePageChange,
} from "helpers/filterHelperFunctions";
import { getDrugOrders, cancelDrugOrder } from "components/graphQL/useQuery";
import { fulfillDrugOrder } from "components/graphQL/Mutation";
import { NoData, EmptyTable } from "components/layouts";
import prettyMoney from "pretty-money";
import { useAlert } from "components/hooks";
const dates = ["Hello", "World", "Goodbye", "World"];
const specializations = ["Dentistry", "Pediatry", "Optometry", "Pathology"];
const hospitals = ["General Hospital, Lekki", "H-Medix", "X Lab"];

const useStyles = makeStyles((theme) => ({
  button: {
    "&.MuiButton-root": {
      background: "#fff",
      color: theme.palette.common.grey,
      textTransform: "none",
      borderRadius: "2rem",
      display: "flex",
      alignItems: "center",
      padding: "0.5rem",
      maxWidth: "12rem",
      fontSize: "1rem",

      "&:hover": {
        background: "#fcfcfc",
      },

      "&:active": {
        background: "#fafafa",
      },

      "& .MuiButton-endIcon>*:nth-of-type(1)": {
        fontSize: ".85rem",
      },

      "& .MuiButton-endIcon": {
        marginLeft: ".2rem",
        marginTop: "-.2rem",
      },
    },
  },
  badge: {
    "&.MuiChip-root": {
      fontSize: "1.25rem !important",
      height: "2.7rem",
      borderRadius: "1.3rem",
    },
  },

  searchFilterBtn: {
    "&.MuiButton-root": {
      ...theme.typography.btn,
      background: theme.palette.common.black,
      width: "100%",
    },
  },
  chip: {
    "&.MuiChip-root": {
      fontSize: "1.25rem",
      height: "3rem",
      borderRadius: "1.3rem",
      background: theme.palette.common.white,
      color: theme.palette.common.grey,
      "& .MuiChip-deleteIcon": {
        color: "inherit",
        fontSize: "inherit",
      },
    },
  },
  cancel: {
    "&.MuiChip-root": {
      color: "red",
    },
  },
  uploadBtn: {
    "&.MuiButton-root": {
      ...theme.typography.btn,
      background: "#f2f2f2",
      boxShadow: "none",
      color: theme.palette.common.black,

      "&:hover": {
        background: "#f2f3f3",
        boxShadow: "none",
      },

      "&:active": {
        boxShadow: "none",
      },
    },
  },
}));

const ProcessingOrders = () => {
  const theme = useTheme();
  const classes = useStyles();
  const { displayMessage } = useAlert();
  const [state, setState] = useState([]);

  const [cancelTest] = useMutation(cancelDrugOrder);
  const handleClose = () => setOpenHcpFilter(false);
  const [fetchDiagnostics, { data, loading, error }] =
    useLazyQuery(getDrugOrders);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
    totalDocs: 0,
  });
  const orderStatus = "pending";

  useEffect(() => {
    if (data) {
      setState(data?.getDrugOrders.data);
      setPageInfo(data?.getDrugOrders.pageInfo);
    }
  }, [data]);
  const prettyDollarConfig = {
    currency: "₦",
    position: "before",
    spaced: false,
    thousandsDelimiter: ",",
  };
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [cancel, setCancel] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDisablePatient, setOpenDisablePatient] = useState(false);
  const [openHcpFilter, setOpenHcpFilter] = useState(false);
  const [fulfill] = useMutation(fulfillDrugOrder);
  const [modal, setModal] = useState(false);
  const handleDialogClose = () => setModal(false);
  const [ids, setId] = useState(null);
  const [cancelId, setCancelId] = useState(null);
  const openCompleteFunc = (id) => {
    setOpenDisablePatient(true);
    setId(id);
  };
  const cancelCompleteFunc = (id) => {
    setOpen(true);
    setCancelId(id);
  };
  const onConfirm = () => setCancel(true);
  const partnerProviderId = localStorage.getItem("partnerProviderId");

  const onSubmit = async (values) => {
    const { reason } = values;
    try {
      await cancelTest({
        variables: {
          id: cancelId,
          reason: reason.trim(),
        },
        refetchQueries: [
          {
            query: getDrugOrders,
            variables: {
              status: "processing",
              partnerProviderId,
            },
          },
          {
            query: getDrugOrders,
            variables: {
              status: "cancelled",
              partnerProviderId,
            },
          },
        ],
      });
      displayMessage("success", "Drug Order Cancelled Successfully");
      history.push("/cancelled-order");
    } catch (error) {
      console.error(error);
      displayMessage("error", error);
    }
  };
  useEffect(() => {
    fetchDiagnostics({
      variables: {
        status: orderStatus,
        first: pageInfo.limit,
        partnerProviderId,
      },
    });
  }, [fetchDiagnostics, partnerProviderId, pageInfo.limit]);

  const darkButton = {
    background: theme.palette.primary.main,
    hover: theme.palette.primary.light,
    active: theme.palette.primary.dark,
  };

  const initialValues = {
    reason: "",
  };
  const validationSchema = Yup.object({
    reason: Yup.string("Enter Reason ").trim().required("Reason is required"),
  });
  const onConfirm2 = async () => {
    try {
      await fulfill({
        variables: {
          id: ids,
        },
        refetchQueries: [
          {
            query: getDrugOrders,
            variables: {
              status: "processing",
              partnerProviderId,
            },
          },
          {
            query: getDrugOrders,
            variables: {
              status: "completed",
              partnerProviderId,
            },
          },
        ],
      });
      displayMessage("success", "Drug Order Fulfilled Successfully");
      history.push("/completed-order");
    } catch (error) {
      console.error(error);
      displayMessage("error", error);
    }

    handleClose();
  };

  const [selectedInput, handleSelectedInput] = useFormInput({
    date: "",
    specialization: "",
    hospital: "",
    status: "",
  });
  // eslint-disable-next-line
  const { date, specialization, hospital } = selectedInput;
  const handleSubmitSearch = async () => {
    try {
      const { data } = await fetchDiagnostics({
        variables: { testId: search, status: orderStatus, partnerProviderId },
      });
      if (data) {
        setState(data?.getDrugOrders.data);
        setPageInfo(data?.getDrugOrders.pageInfo);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const buttonType = {
    background: theme.palette.common.black,
    hover: theme.palette.primary.main,
    active: theme.palette.primary.dark,
  };
  const { rowsPerPage, selectedRows, page } = useSelector(
    (state) => state.tables
  );
  const { setSelectedRows } = useActions();
  if (loading) return <Loader />;
  if (error) return <NoData error={error} />;

  return (
    <Grid container direction="column" gap={2} flexWrap="nowrap" height="100%">
      <Grid item container spacing={{ md: 4, sm: 4, xs: 2 }}>
        <Grid item flex={1}>
          <Search
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type to search Test by orderId..."
          />
        </Grid>
        <Grid item>
          <CustomButton
            title="Search"
            type={buttonType}
            disabled={!search}
            onClick={handleSubmitSearch}
          />
        </Grid>
      </Grid>
      {state.length > 0 ? (
        <Grid item container height="100%" direction="column">
          <EnhancedTable
            headCells={hcpsHeadCells}
            rows={state}
            page={page}
            paginationLabel="orders per page"
            hasCheckbox={true}
            changeLimit={(e) => {
              changeTableLimit(e, fetchDiagnostics, orderStatus);
            }}
            dataPageInfo={pageInfo}
            handlePagination={(page) => {
              handlePageChange(fetchDiagnostics, page, pageInfo, orderStatus);
            }}
          >
            {state
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const { _id, createdAt, prescriptions, orderId, patientData } =
                  row;
                const isItemSelected = isSelected(_id, selectedRows);
                const x = prescriptions.map((i) => i.drugPrice);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={_id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        onClick={() =>
                          handleSelectedRows(_id, selectedRows, setSelectedRows)
                        }
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      id={labelId}
                      scope="row"
                      align="left"
                      className={classes.tableCell}
                    >
                      {dateMoment(createdAt)}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {timeMoment(createdAt)}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {orderId}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: "1.25rem" }}>
                          {patientData
                            ? `${patientData?.firstName} ${patientData?.lastName}`
                            : "No Value"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {prettyMoney(
                        prettyDollarConfig,
                        x.reduce(function (accumulator, currentValue) {
                          return accumulator + currentValue;
                        }, 0)
                      )}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {x.length}
                    </TableCell>

                    <TableCell>
                      <Grid container flexWrap="nowrap" gap={2}>
                        <Chip
                          label="complete order"
                          variant="outlined"
                          onClick={() => openCompleteFunc(_id)}
                          className={classes.chip}
                          deleteIcon={<ArrowForwardIosIcon />}
                        />
                        <Chip
                          label="cancel order"
                          variant="outlined"
                          onClick={() => cancelCompleteFunc(_id)}
                          className={`${classes.chip} ${classes.cancel}`}
                          deleteIcon={<ArrowForwardIosIcon />}
                        />
                      </Grid>
                    </TableCell>
                  </TableRow>
                );
              })}
          </EnhancedTable>
        </Grid>
      ) : (
        <EmptyTable
          headCells={hcpsHeadCells}
          paginationLabel="Orders  per page"
          text="No Processing Order"
        />
      )}
      {/* Filter Modal */}
      <Success
        open={modal}
        handleDialogClose={handleDialogClose}
        title="SUCCESSFUL"
        btnValue="Done"
        confirmationMsg="Your order has been successful"
      />

      <DisablePatient
        open={openDisablePatient}
        setOpen={setOpenDisablePatient}
        title="Complete Order"
        btnValue="complete"
        confirmationMsg="Complete Order"
        onConfirm={onConfirm2}
      />
      <DisablePatient
        open={open}
        setOpen={setOpen}
        title="Cancel Order"
        btnValue="cancel"
        confirmationMsg="Cancel Order"
        onConfirm={onConfirm}
      />
      <Modals
        isOpen={openHcpFilter}
        title="Filter"
        rowSpacing={5}
        handleClose={handleClose}
      >
        <Grid item container direction="column">
          <Grid item>
            <Grid container spacing={2}>
              <Grid item md>
                <Grid container direction="column">
                  <Grid item>
                    <FormLabel component="legend" className={classes.FormLabel}>
                      Date
                    </FormLabel>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <FormSelect
                        name="date"
                        options={dates}
                        value={date}
                        onChange={handleSelectedInput}
                        placeholderText="Choose Date"
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md>
                <Grid container direction="column">
                  <Grid item>
                    <FormLabel component="legend" className={classes.FormLabel}>
                      Time
                    </FormLabel>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <FormSelect
                        name="Time"
                        options={specializations}
                        value={specialization}
                        onChange={handleSelectedInput}
                        placeholderText="Select Time"
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item style={{ marginBottom: "18rem", marginTop: "3rem" }}>
            <Grid container spacing={2}>
              <Grid item md>
                <Grid container direction="column">
                  <Grid item>
                    <FormLabel component="legend" className={classes.FormLabel}>
                      Order Number
                    </FormLabel>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth style={{ height: "3rem" }}>
                      <FormSelect
                        name="Order Number"
                        options={hospitals}
                        value={hospital}
                        onChange={handleSelectedInput}
                        placeholderText="Enter order number"
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md></Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => setOpenHcpFilter(false)}
              type="submit"
              className={classes.searchFilterBtn}
            >
              Apply Filter
            </Button>
          </Grid>
        </Grid>
      </Modals>
      <Modals
        isOpen={cancel}
        title="Cancel Order"
        rowSpacing={5}
        handleClose={() => setCancel(false)}
      >
        <Formik
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          validateOnChange={false}
          validateOnMount={false}
          initialValues={initialValues}
          enableReinitialize
        >
          {({ isSubmitting, dirty, isValid }) => {
            return (
              <Form style={{ marginTop: "3rem" }}>
                <Grid container>
                  <Grid item container>
                    <FormikControl
                      control="input"
                      label="State a Reason"
                      name="reason"
                      placeholder="Enter reason"
                    />
                  </Grid>
                  <Grid item container sx={{ flexGrow: 1, marginTop: "10rem" }}>
                    <CustomButton
                      title="Cancel Order"
                      type={darkButton}
                      width="100%"
                      isSubmitting={isSubmitting}
                      disabled={!(dirty || isValid)}
                    />
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Modals>
    </Grid>
  );
};

export default ProcessingOrders;
