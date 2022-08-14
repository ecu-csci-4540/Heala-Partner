import React, { useState, useEffect } from "react";
import { Grid, Typography, Divider } from "@mui/material";
import PropTypes from "prop-types";
import GroupIcon from "@mui/icons-material/Group";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
  financialPercent,
  returnpercent,
  selectOptions,
  consultationsOptions,
  newOptions,
  formatNumber,
} from "components/Utilities/Time";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
// import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import {
  LineChart2,
  CircularProgressBar,
  FormSelect,
} from "components/Utilities";
import "chartjs-plugin-style";
import { ArrowDownwardOutlined } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  chartCard: {
    // background: "#fff",
    borderRadius: "1rem",
  },
  chartImg: {
    maxWidth: "100%",
  },
  headerGrid: {
    background: "rgb(253, 253, 253)",
    width: "100%",
    borderTopLeftRadius: "1rem",
    borderTopRightRadius: "1rem",
    padding: "1.5rem 2rem",
  },
  overviewGrid: {
    padding: "4rem 2rem 3rem",
  },
  groupIconGrid: {
    width: "5rem",
    height: "5rem",
    background: theme.palette.common.lightGreen,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  groupIcon: {
    "&.MuiSvgIcon-root": {
      fontSize: "2.5rem",
    },
  },
  bottomChartGrid: {
    padding: "3rem 2rem",
  },

  dottedCircle: {
    width: 12,
    height: 12,
    border: "4px solid",
    borderRadius: "50%",
  },
  red: {
    borderColor: theme.palette.common.red,
  },
  green: {
    borderColor: theme.palette.common.green,
  },

  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  greenIconBg: {
    background: theme.palette.common.lightGreen,
  },
  redIconBg: {
    background: theme.palette.common.lightRed,
  },

  greenNotificationBg: {
    background: theme.palette.common.green,
  },

  notificationIcon: {
    "&.MuiSvgIcon-root": {
      color: "#fff",
    },
  },
}));

const HopsitalDashboardChart = ({ data }) => {
  const classes = useStyles();
  const theme = useTheme();

  const [patients, setPatients] = useState([]);
  const [doctorStats, setDoctorStats] = useState([]);
  const [totalEarning, setTotalEarning] = useState(0);
  const [totalPayouts, setTotalPayouts] = useState(0);
  const [totalConsultations, setTotalConsultations] = useState("");
  const [totalSubs, setTotalSub] = useState(0);
  const [activeSubsNumber, setActiveSubsNumber] = useState(0);
  const [inActiveSubsNumber, setInActiveSubsNumber] = useState(0);
  const [consultationState, setConsultationState] = useState({
    state: "all",
    data: {
      complete: data?.getStats?.consultationStats.completedChartData,
      ongoing: data?.getStats?.consultationStats.ongoingChartData,
      accept: data?.getStats?.consultationStats.acceptedChartData,
      decline: data?.getStats?.consultationStats.declinedChartData,
      cancel: data?.getStats?.consultationStats.cancelledChartData,
    },
  });

  const [graphState, setGraphState] = useState({
    state: "all",
    data: {
      active: data?.getStats?.doctorStats.activeChartData,
      inactive: data?.getStats?.doctorStats.inactiveChartData,
    },
  });
  const [subScriptionState, setSubScriptionState] = useState({
    state: "all",
    data: {
      active: data?.getStats?.subscriptionStats.activeChartData,
      inactive: data?.getStats?.subscriptionStats.inactiveChartData,
    },
  });
  const [patientGraphState, setPatientGraphState] = useState({
    state: "all",
    data: {
      active: data?.getStats?.patientStats.activeChartData,
      inactive: data?.getStats?.patientStats.inactiveChartData,
    },
  });

  useEffect(() => {
    setPayoutArray(data?.getStats?.payoutStats?.chartData);
    setEarningArray(data?.getStats?.earningStats?.chartData);
  }, [data]);
  useEffect(() => {
    const {
      // eslint-disable-next-line
      patientStats,
      doctorStats,
      subscriptionStats,
      payoutStats,
      consultationStats,
      earningStats,
    } = data?.getStats;
    setPatients(patientStats);
    setDoctorStats(doctorStats);
    setTotalConsultations(consultationStats);
    setInActiveSubsNumber(subscriptionStats?.totalInactive);
    setActiveSubsNumber(subscriptionStats?.totalActive);
    setTotalSub(
      subscriptionStats?.totalActive + subscriptionStats?.totalInactive
    );
    setPayoutArray(payoutStats?.chartData);
    setEarningArray(earningStats?.chartData);
    setTotalEarning(earningStats?.total);
    setTotalPayouts(payoutStats?.total);
    const value = financialPercent(totalEarning, totalPayouts);
    setFinances(value);
    //eslint-disable-next-line
  }, [data]);

  const {
    totalAccepted,
    totalCancelled,
    totalOngoing,
    totalDeclined,
    totalCompleted,
  } = totalConsultations;
  const total =
    totalAccepted +
    totalCancelled +
    totalOngoing +
    totalDeclined +
    totalCompleted;

  const financialValue = financialPercent(totalEarning, totalPayouts);
  const [finances, setFinances] = useState(financialValue);
  const { totalActive: activeDoctors, totalInactive: inactiveDoctors } =
    doctorStats;
  const { totalActive: activePatients, totalInactive: inactivePatients } =
    patients;
  const totalDoc = activeDoctors + inactiveDoctors;
  const totalPatient = activePatients + inactivePatients;
  const patientPercentage = returnpercent(activePatients, inactivePatients);
  const doctorPercentage = returnpercent(activeDoctors, inactiveDoctors);
  const [forms, setForms] = useState("");
  const [payoutArray, setPayoutArray] = useState([]);
  const [earningArray, setEarningArray] = useState([]);
  const onChange = async (e) => {
    const { value } = e.target;
    setForms(value);
    //eslint-disable-next-line
    earningArray?.map((item) => {
      if (item?.month === value) {
        setTotalEarning(item?.sum);
      }
    });
    //eslint-disable-next-line
    payoutArray?.map((item) => {
      if (item?.month === value) {
        setTotalPayouts(item?.sum);
      }
    });
  };
  const consultationFunc = (e) => {
    const { value } = e.target;

    switch (value) {
      case "Cancelled":
        setConsultationState({
          ...consultationState,
          state: "Cancelled",
        });
        break;
      case "Accepted":
        setConsultationState({
          ...consultationState,
          state: "Accepted",
        });
        break;
      case "Ongoing":
        setConsultationState({
          ...consultationState,
          state: "Ongoing",
        });
        break;
      case "Completed":
        setConsultationState({
          ...consultationState,
          state: "Completed",
        });
        break;
      case "Declined":
        setConsultationState({
          ...consultationState,
          state: "Declined",
        });
        break;
      default:
        return setConsultationState({
          ...consultationState,
          state: "all",
        });
    }
  };
  const graphFunc = (e) => {
    const { value } = e.target;
    switch (value) {
      case "active":
        return setGraphState({
          ...graphState,
          state: "active",
        });

      case "inactive":
        return setGraphState({
          ...graphState,
          state: "inactive",
        });

      case "all":
        return setGraphState({
          ...graphState,
          state: "all",
        });
      default:
        return setGraphState({
          ...graphState,
          state: "all",
        });
    }
  };
  const patientGraphFunc = (e) => {
    const { value } = e.target;

    switch (value) {
      case "active":
        return setPatientGraphState({
          ...patientGraphState,
          state: "active",
        });
      case "inactive":
        return setPatientGraphState({
          ...patientGraphState,
          state: "inactive",
        });
      case "all":
        return setPatientGraphState({
          ...patientGraphState,
          state: "all",
        });
      default:
        return setPatientGraphState({
          ...patientGraphState,
          state: "all",
        });
    }
  };
  const subGraphFunc = (e) => {
    const { value } = e.target;
    switch (value) {
      case "active":
        return setSubScriptionState({
          ...subScriptionState,
          state: "active",
        });
      case "inactive":
        return setSubScriptionState({
          ...subScriptionState,
          state: "inactive",
        });
      case "all":
        return setSubScriptionState({
          ...subScriptionState,
          state: "all",
        });
      default:
        setSubScriptionState({
          ...subScriptionState,
          state: "all",
        });
    }
  };

  return (
    <Grid
      container
      justifyContent="space-between"
      display="grid"
      padding=".5rem" //repeat(auto-fit, minmax(250px, 1fr));
      gridTemplateColumns={{
        sm: "repeat(2,1fr)",
        md: "repeat(2,1fr)",
        xs: "repeat(1,1fr)",
      }}
      gap={2}
      rowSpacing={3}
    >
      {/* doctor */}
      <Grid item container className={classes.chartCard}>
        <Grid item className={classes.headerGrid}>
          <Typography variant="h5">Doctor Stats</Typography>
        </Grid>
        <Divider color={theme.palette.common.lighterGrey} />

        <Grid
          item
          container
          flexWrap="nowrap"
          paddingY={{ md: 2, sm: 2, xs: 2 }}
          justifyContent="space-between"
        >
          <Grid
            item
            gap={{ sm: 3, xs: 2, md: 3 }}
            alignItems="center"
            flexWrap={"nowrap"}
            container
            flex={3}
          >
            <Grid item className={classes.groupIconGrid}>
              <GroupIcon color="success" className={classes.groupIcon} />
            </Grid>
            <Grid item alignItems="center" container flex={1}>
              <Grid item container direction="column">
                <Grid item container gap={1}>
                  <Typography variant="h1">{data && totalDoc}</Typography>
                  <Grid item>
                    {doctorPercentage < 1 ? (
                      <ArrowDownwardOutlined sx={{ color: "#f2190a" }} />
                    ) : (
                      <ArrowUpwardIcon color="success" />
                    )}
                  </Grid>
                  <Typography
                    style={{
                      color:
                        doctorPercentage < 1
                          ? "#f2190a"
                          : theme.palette.success.main,
                    }}
                    variant="body2"
                  >
                    {doctorPercentage
                      ? `${Math.abs(doctorPercentage.toFixed(0))} %`
                      : 0}
                  </Typography>
                </Grid>
              </Grid>
              <Typography
                variant="body2"
                style={{
                  color: theme.palette.common.lightGrey,
                  whiteSpace: "nowrap",
                }}
              >
                Total Doctors
              </Typography>
            </Grid>
          </Grid>

          <Grid item>
            <FormSelect
              value={graphState?.state}
              onChange={graphFunc}
              options={newOptions}
              name="graph"
            />
          </Grid>
        </Grid>

        <Divider color={theme.palette.common.lighterGrey} />
        <Grid
          item
          container
          marginY={{ sm: 3, md: 3, xs: 2 }}
          direction="column"
        >
          <LineChart2 graphState={graphState} optionsValue={newOptions} />

          {/* Line */}
          <Grid
            item
            container
            justifyContent="space-between"
            paddingTop={{ sm: 3, xs: 2 }}
          >
            <Grid item>
              <Grid container direction="column">
                <Grid item>
                  <Typography variant="h3" gutterBottom>
                    {doctorStats?.totalActive}
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container alignItems="center">
                    <Grid item style={{ marginRight: "1rem" }}>
                      <div
                        className={`${classes.dottedCircle} ${classes.green}`}
                      ></div>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body2"
                        style={{ color: theme.palette.common.lightGrey }}
                      >
                        Total active Doctors
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction="column" justifyContent="center">
                <Grid item>
                  <Typography variant="h3" gutterBottom>
                    {doctorStats?.totalInactive}
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container alignItems="center">
                    <Grid item style={{ marginRight: "1rem" }}>
                      <div
                        className={`${classes.dottedCircle} ${classes.red}`}
                      ></div>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body2"
                        style={{ color: theme.palette.common.lightGrey }}
                      >
                        Total inactive Doctors
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* patients */}
      <Grid item container className={classes.chartCard}>
        <Grid item className={classes.headerGrid}>
          <Typography variant="h5">Patients Stats</Typography>
        </Grid>
        <Divider color={theme.palette.common.lighterGrey} />

        <Grid
          item
          container
          flexWrap="nowrap"
          paddingY={{ md: 2, sm: 2, xs: 2 }}
          justifyContent="space-between"
        >
          <Grid
            item
            gap={{ sm: 3, xs: 2, md: 3 }}
            alignItems="center"
            flexWrap={"nowrap"}
            container
            flex={3}
          >
            <Grid item className={classes.groupIconGrid}>
              <GroupIcon color="success" className={classes.groupIcon} />
            </Grid>
            <Grid item alignItems="center" container flex={1}>
              <Grid item container direction="column">
                <Grid item container gap={1}>
                  <Typography variant="h1">{data && totalPatient}</Typography>
                  <Grid item>
                    {patientPercentage < 1 ? (
                      <ArrowDownwardOutlined sx={{ color: "#f2190a" }} />
                    ) : (
                      <ArrowUpwardIcon color="success" />
                    )}
                  </Grid>
                  <Typography
                    style={{
                      color:
                        patientPercentage < 1
                          ? "#f2190a"
                          : theme.palette.success.main,
                    }}
                    variant="body2"
                  >
                    {patientPercentage
                      ? `${Math.abs(patientPercentage.toFixed(0))} %`
                      : 0}
                  </Typography>
                </Grid>
              </Grid>
              <Typography
                variant="body2"
                style={{
                  color: theme.palette.common.lightGrey,
                  whiteSpace: "nowrap",
                }}
              >
                Total Patients
              </Typography>
            </Grid>
          </Grid>

          <Grid item>
            <FormSelect
              value={patientGraphState?.state}
              onChange={patientGraphFunc}
              options={newOptions}
              name="graph"
            />
          </Grid>
        </Grid>

        <Divider color={theme.palette.common.lighterGrey} />
        <Grid
          item
          container
          marginY={{ sm: 3, md: 3, xs: 2 }}
          direction="column"
        >
          <LineChart2
            graphState={patientGraphState}
            optionsValue={newOptions}
          />

          {/* Line */}
          <Grid
            item
            container
            justifyContent="space-between"
            paddingTop={{ sm: 3, xs: 2 }}
          >
            <Grid item>
              <Grid container direction="column">
                <Grid item>
                  <Typography variant="h3" gutterBottom>
                    {data && patients.totalActive}
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container alignItems="center">
                    <Grid item style={{ marginRight: "1rem" }}>
                      <div
                        className={`${classes.dottedCircle} ${classes.green}`}
                      ></div>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body2"
                        style={{ color: theme.palette.common.lightGrey }}
                      >
                        Total active Patients
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction="column" justifyContent="center">
                <Grid item>
                  <Typography variant="h3" gutterBottom>
                    {patients?.totalInactive}
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container alignItems="center">
                    <Grid item style={{ marginRight: "1rem" }}>
                      <div
                        className={`${classes.dottedCircle} ${classes.red}`}
                      ></div>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body2"
                        style={{ color: theme.palette.common.lightGrey }}
                      >
                        Total inactive Patients
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* active subscribers */}

      <Grid item container className={classes.chartCard}>
        <Grid item className={classes.headerGrid}>
          <Typography variant="h5">Subscribers Stats</Typography>
        </Grid>
        <Divider color={theme.palette.common.lighterGrey} />

        <Grid
          item
          container
          flexWrap="nowrap"
          paddingY={{ md: 2, sm: 2, xs: 2 }}
          justifyContent="space-between"
        >
          <Grid
            item
            gap={{ sm: 3, xs: 2, md: 3 }}
            alignItems="center"
            flexWrap={"nowrap"}
            container
            flex={3}
          >
            <Grid item className={classes.groupIconGrid}>
              <GroupIcon color="success" className={classes.groupIcon} />
            </Grid>
            <Grid item alignItems="center" container flex={1}>
              <Grid item container direction="column">
                <Grid item container gap={1}>
                  <Typography variant="h1"> {totalSubs}</Typography>
                </Grid>
              </Grid>
              <Typography
                variant="body2"
                style={{
                  color: theme.palette.common.lightGrey,
                  whiteSpace: "nowrap",
                }}
              >
                Total Subscribers
              </Typography>
            </Grid>
          </Grid>

          <Grid item>
            <FormSelect
              value={subScriptionState?.state}
              onChange={subGraphFunc}
              options={newOptions}
              name="partner-select"
            />
          </Grid>
        </Grid>

        <Divider color={theme.palette.common.lighterGrey} />
        <Grid
          item
          container
          marginY={{ sm: 3, md: 3, xs: 2 }}
          direction="column"
        >
          <LineChart2
            graphState={subScriptionState}
            optionsValue={newOptions}
          />

          {/* Line */}
        </Grid>
        <Grid
          item
          container
          flexWrap="nowrap"
          justifyContent="space-between"
          paddingTop={{ sm: 3, xs: 2 }}
        >
          <Grid item>
            <Grid container direction="column">
              <Grid item>
                <Typography variant="h3" gutterBottom>
                  {data && activeSubsNumber}
                </Typography>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item style={{ marginRight: "1rem" }}>
                    <div
                      className={`${classes.dottedCircle} ${classes.green}`}
                    ></div>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="body2"
                      style={{ color: theme.palette.common.lightGrey }}
                    >
                      Total active Subscribers
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column" justifyContent="center">
              <Grid item>
                <Typography variant="h3" gutterBottom>
                  {data && inActiveSubsNumber}
                </Typography>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item style={{ marginRight: "1rem" }}>
                    <div
                      className={`${classes.dottedCircle} ${classes.red}`}
                    ></div>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="body2"
                      style={{ color: theme.palette.common.lightGrey }}
                    >
                      Total inactive Subscribers
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* finance Stats */}
      <Grid item container className={classes.chartCard}>
        <Grid
          item
          container
          flexWrap="nowrap"
          paddingY={{ md: 2, sm: 2, xs: 2 }}
          justifyContent="space-between"
        >
          <Grid
            item
            gap={{ sm: 3, xs: 2, md: 3 }}
            // alignItems="center"
            flexWrap="nowrap"
            container
            flex={3}
          >
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              flex={{ sm: 1 }}
              alignSelf="flex-start"
              flexWrap={"nowrap"}
            >
              <Grid item flex={1}>
                <Typography variant="h5">Financial Stats</Typography>
              </Grid>
              <Grid item>
                <FormSelect
                  placeholder="Select Months"
                  value={forms}
                  onChange={onChange}
                  options={selectOptions}
                  name="finance"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider color={theme.palette.common.lighterGrey} />
        <Grid
          item
          container
          justifySelf={{ xs: "center", md: "space-between" }}
          // justifyContent="space-between"
          flexWrap={{ sm: "nowrap" }}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          rowGap={{ xs: "4rem" }}
          paddingY={{ xs: "1rem" }}
          className={classes.overviewGrid}
        >
          <Grid item marginRight={{ sm: "2rem", md: "2rem" }}>
            <CircularProgressBar
              height="20rem"
              width="20rem"
              color={theme.palette.common.green}
              trailColor={theme.palette.common.red}
              value={finances}
              strokeWidth={8}
            />
          </Grid>
          <Grid
            item
            container
            padding={0}
            flexWrap="nowrap"
            justifySelf={"center"}
            flexDirection={{ xs: "row" }}
            justifyContent="center"
          >
            <Grid
              item
              container
              gap={{ sm: 2, xs: 1 }}
              justifyContent="center"
              alignItems="center"
            >
              <Grid
                item
                className={`${classes.iconWrapper} ${classes.greenIconBg}`}
              >
                <TrendingDownIcon color="success" />
              </Grid>
              <Grid item>
                <Grid container direction="column">
                  <Grid item>
                    <Typography variat="h3">
                      <span
                        style={{
                          textDecoration: "line-through",
                          textDecorationStyle: "double",
                        }}
                      >
                        N
                      </span>
                      {formatNumber(totalEarning)}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="body2"
                      style={{
                        color: theme.palette.common.lightGrey,
                      }}
                    >
                      Total earnings
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              container
              justifyContent="center"
              gap={{ sm: 2, xs: 1 }}
              alignItems="center"
            >
              <Grid
                item
                className={`${classes.iconWrapper} ${classes.redIconBg}`}
              >
                <TrendingUpIcon color="error" />
              </Grid>
              <Grid item>
                <Grid container direction="column">
                  <Grid item>
                    <Typography variat="h3">
                      <span
                        style={{
                          textDecoration: "line-through",
                          textDecorationStyle: "double",
                        }}
                      >
                        N
                      </span>
                      {formatNumber(totalPayouts)}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="body2"
                      style={{
                        color: theme.palette.common.lightGrey,
                      }}
                    >
                      Total payouts
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid
          container
          flex={{ sm: 1 }}
          direction="column"
          className={classes.chartCard}
          alignSelf="flex-end"
        >
          <Grid item>
            <Typography variant="h5">Appointment Stats</Typography>
          </Grid>

          <Grid item container paddingY={{ sm: 3, md: 3, xs: 2 }}>
            <Grid item container justifyContent="space-between">
              <Grid item>
                <Grid container gap={2}>
                  <Grid
                    item
                    className={`${classes.iconWrapper} ${classes.greenNotificationBg}`}
                  >
                    <NotificationsActiveIcon
                      className={classes.notificationIcon}
                    />
                  </Grid>

                  <Grid item direction="column">
                    <Typography variant="h5">
                      {appointmentStats?.totalUpcoming
                        ? appointmentStats?.totalUpcoming
                        : 0}
                    </Typography>

                    <Typography
                      variant="body2"
                      style={{ color: theme.palette.common.lightGrey }}
                    >
                      Total Upcoming
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container>
                  <Grid
                    item
                    className={`${classes.iconWrapper} ${classes.greenNotificationBg}`}
                  >
                    <NotificationsActiveIcon
                      className={classes.notificationIcon}
                    />
                  </Grid>
                  <Grid item style={{ marginLeft: "1em" }}>
                    <Grid container direction="column">
                      <Grid item>
                        <Typography variant="h4">
                          {appointmentStats?.totalPast
                            ? appointmentStats?.totalPast
                            : 0}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          variant="body2"
                          style={{ color: theme.palette.common.lightGrey }}
                        >
                          Total Past
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid> */}
      </Grid>
      {/* consultation stats */}
      <Grid
        item
        gridColumn={{ md: "1/3" }}
        container
        className={classes.chartCard}
      >
        <Grid item className={classes.headerGrid}>
          <Typography variant="h5">Consultations Stats</Typography>
        </Grid>
        <Divider color={theme.palette.common.lighterGrey} />

        <Grid
          item
          container
          flexWrap="nowrap"
          paddingY={{ md: 2, sm: 2, xs: 2 }}
          justifyContent="space-between"
        >
          <Grid
            item
            gap={{ sm: 3, xs: 2, md: 3 }}
            alignItems="center"
            flexWrap="nowrap"
            container
            flex={3}
          >
            <Grid item className={classes.groupIconGrid}>
              <GroupIcon color="success" className={classes.groupIcon} />
            </Grid>
            <Grid item alignItems="center" container flex={1}>
              <Grid item container direction="column">
                <Grid item container gap={1}>
                  <Typography variant="h1">{data && total}</Typography>
                </Grid>
              </Grid>
              <Typography
                variant="body2"
                style={{
                  color: theme.palette.common.lightGrey,
                  whiteSpace: "nowrap",
                }}
              >
                Total Consultations
              </Typography>
            </Grid>
          </Grid>

          <Grid item>
            <FormSelect
              value={consultationState?.state}
              onChange={consultationFunc}
              options={consultationsOptions}
              name="consulation-select"
            />
          </Grid>
        </Grid>

        <Divider color={theme.palette.common.lighterGrey} />
        <Grid
          item
          container
          marginY={{ sm: 3, md: 3, xs: 2 }}
          direction="column"
        >
          <LineChart2
            graphState={consultationState}
            optionsValue={consultationsOptions}
            type="consultation"
          />
        </Grid>
        <Grid
          item
          container
          justifyContent="space-between"
          paddingTop={{ sm: 3, xs: 2 }}
        >
          <Grid item>
            <Grid container direction="column">
              <Grid item>
                <Typography variant="h3" gutterBottom>
                  {data?.getStats?.consultationStats?.totalAccepted}
                </Typography>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item style={{ marginRight: "1rem" }}>
                    <div
                      className={`${classes.dottedCircle} ${classes.green}`}
                    ></div>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="body2"
                      style={{ color: theme.palette.common.lightGrey }}
                    >
                      Accepted
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column" justifyContent="center">
              <Grid item>
                <Typography variant="h3" gutterBottom>
                  {data?.getStats?.consultationStats?.totalCompleted}
                </Typography>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item style={{ marginRight: "1rem" }}>
                    <div
                      className={`${classes.dottedCircle} ${classes.green}`}
                    ></div>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="body2"
                      style={{ color: theme.palette.common.lightGrey }}
                    >
                      Completed
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column" justifyContent="center">
              <Grid item>
                <Typography variant="h3" gutterBottom>
                  {data?.getStats?.consultationStats?.totalCancelled}
                </Typography>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item style={{ marginRight: "1rem" }}>
                    <div
                      className={`${classes.dottedCircle} ${classes.gold}`}
                    ></div>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="body2"
                      style={{ color: theme.palette.common.lightGrey }}
                    >
                      Cancelled
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Grid container direction="column" justifyContent="center">
              <Grid item>
                <Typography variant="h3" gutterBottom>
                  {data?.getStats?.consultationStats?.totalDeclined}
                </Typography>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item style={{ marginRight: "1rem" }}>
                    <div
                      className={`${classes.dottedCircle} ${classes.gold}`}
                    ></div>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="body2"
                      style={{ color: theme.palette.common.lightGrey }}
                    >
                      Declined
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column" justifyContent="center">
              <Grid item>
                <Typography variant="h3" gutterBottom>
                  {data?.getStats?.consultationStats?.totalOngoing}
                </Typography>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item style={{ marginRight: "1rem" }}>
                    <div
                      className={`${classes.dottedCircle} ${classes.red}`}
                    ></div>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="body2"
                      style={{ color: theme.palette.common.lightGrey }}
                    >
                      Ongoing
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

HopsitalDashboardChart.propTypes = {
  data: PropTypes.object,
  refetch: PropTypes.func,
};

export default HopsitalDashboardChart;
