/* eslint-disable react-hooks/exhaustive-deps */
import Barchart from '../Charts/BarChart';
import PieChart from '../Charts/PieChart';
import Dropdown from '../Dropdown/Dropdown';
import MaleIcon from '../Charts/SVG/MaleIcon';
import { useTranslation } from 'react-i18next';
import FemaleIcon from '../Charts/SVG/FemaleIcon';
import Progressbar from '../ProgressBar/Progressbar';
import { Box, Typography } from '@mui/material';
import jwtInterceptor from '../../services/interceptors';
import ProgressiveChart from '../Charts/ProgressiveChart';
import React, { useEffect, useState, useRef } from 'react';
import { preparePieChartData } from '../../utils/formaters';
import { Decrease_Icon, Increase_Icon } from '../../assets/images';
import { ProgressLoader } from '../Global/GlobalLoader';

// const styles: any = {
//   statsContainer: {
//     flex: 1,
//     display: 'flex',
//     padding: '24px',
//     maxWidth: '492px',
//     border: '1px solid rgba(9, 44, 76, 0.1)',
//     borderRadius: '20px',
//     gap: '15px',
//     alignItems: 'center',

//     '@media (max-width: 600px)': {
//       padding: '10px',
//     },
//   },
//   statIcon: {
//     padding: '15px',
//     borderRadius: '50%',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'start',
//     svg: {
//       color: '#18A0FB',
//     },
//     backgroundColor: alpha('#18A0FB', 0.1),
//   },
//   statBox: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '7px',
//   },
// };

const API_URL = process.env.REACT_APP_API_PROFILE_SERVICE_URL;
const devURL = process.env.REACT_APP_API_LEAVE_SERVICE_URL;

function Dashboard(): JSX.Element {
  const [hrkpis, sethrkpis] = useState<any>({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [skills, setskills] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [topSkills, setTopSkills] = useState<any>(null);
  const [expoertise, setExpertise] = useState<any>(null);
  const [leaves, setLeaves] = useState<any>({
    sickLeaves: null,
    annualLeaves: null,
  });
  const [getLeavesData, setGetLeaveData] = useState<any>(null);
  const [isMonthlyLeaves, setIsMonthlyLeaves] = useState<boolean>(true);
  const [certificateData, setCertificateDate] = useState<any>(null);
  const [employeeIncrease, setEmployeeIncrease] = useState<boolean>(false);
  const [certificateIncrease, setCertificateIncrease] =
    useState<boolean>(false);

  const initialized = useRef<boolean>(false);

  const bearerToken: string | null = sessionStorage.getItem('token_key');
  const base_url = process.env.REACT_APP_BASE_URL;

  const { t }: any = useTranslation();

  const GetHRKPIsData = () => {
    jwtInterceptor
      .get('api/HrDashboard/GetHrDashboard')
      .then((response: any) => {
        sethrkpis(() => ({
          ...hrkpis,
          ...response.data,
        }));
        //
        let skillsInfo = [];
        let item1 = {
          id: 1,
          name: 'Number of Expert',
          value: response.data.noOfExpert,
          color: '#964CF5',
        };

        let item2 = {
          id: 2,
          name: 'Number of  Advanced',
          value: response.data.noOfAdvanced,
          color: '#18A0FB',
        };
        let item3 = {
          id: 3,
          name: 'Number of Basic',
          value: response.data.noOfBasic,
          color: '#37D310',
        };
        let item4 = {
          id: 4,
          name: 'Number of Trainee',
          value: response.data.noOfTrainee,
          color: '#E01C63',
        };

        skillsInfo.push(item1);
        skillsInfo.push(item2);
        skillsInfo.push(item3);
        skillsInfo.push(item4);
        setskills(skillsInfo);
        setLoading(false);
      });
  };

  const GetTopSkills = () => {
    const url = `${API_URL}/api/HrDashboard/GetHrDashboardTopSkillsv2`
    jwtInterceptor
      .get(url)
      .then((response: any) => {
        const sortedData =
          response?.data
            ?.map((item: any) => {
              return {
                ...item,
                percentage: Number(item?.percentage?.split('%')[0]),
              };
            })
            ?.sort(function (a: any, b: any) {
              return b?.percentage - a?.percentage;
            });

        setTopSkills(sortedData);
        setLoading(false);
      });
  };

  const getLeavesDataFromAPI = async (): Promise<void> => {
    const url = `${devURL}/api/HrLeave/GetAllHrDashBoardLeaveListMonthYearWise`
    jwtInterceptor
      .get(url)
      .then((res: any) => {
        setGetLeaveData(res?.data);
        setLoading(false);
      });
  };

  const GetSkillsWithExpertise = async (): Promise<void> => {
    const url = `${API_URL}/api/HrDashboard/GetHrDashboardTopSkillsExperWise`
    jwtInterceptor
      .get(url)
      .then((response: any) => {
        setExpertise(response?.data);
        setLoading(false);
      });
  };

  const GetCertificaionData = async (): Promise<void> => {
    const url = `${API_URL}/api/HrDashboard/GetHrDashboard`
    jwtInterceptor
      .get(url)
      .then((response: any) => {
        setCertificateDate(response?.data);
        setLoading(false);
      });
  };

  const parsePercentage = (value: string): number =>
    Number(value?.split('%')[0]);

  useEffect(() => {
    if (!initialized.current) {
      if (bearerToken) {
        initialized.current = true;
        setLoading(true);
        GetHRKPIsData();
        GetTopSkills();
        GetSkillsWithExpertise();
        GetCertificaionData();
        getLeavesDataFromAPI();
      } else {
        window.location.href = base_url + '/login';
      }
    }
  }, []);

  useEffect(() => {
    if (certificateData) {
      // For employee increase rate
      let employeeIncreaseRate = parsePercentage(
        certificateData?.employeeChangePercent
      );

      setEmployeeIncrease(employeeIncreaseRate > 0);

      // For certificate increase rate
      let certificateIncreaseRate = parsePercentage(
        certificateData?.certificateChangePercent
      );

      setCertificateIncrease(certificateIncreaseRate > 0);
    }
  }, [certificateData]);

  useEffect(() => {
    if (getLeavesData) {
      if (isMonthlyLeaves) {
        setLeaves({
          sickLeaves: getLeavesData?.sickLeaves?.last12Months,
          annualLeaves: getLeavesData?.annualLeaves?.last12Months,
        });
      } else {
        setLeaves({
          sickLeaves: getLeavesData?.sickLeaves?.last10Years,
          annualLeaves: getLeavesData?.annualLeaves?.last10Years,
        });
      }
    }
  }, [isMonthlyLeaves, getLeavesData]);

  const width = window.innerWidth;

  return (
    <>
      {loading ? (
        <ProgressLoader loading={loading} />
      ) : (
        <>
          <div>
            <Box
              sx={(theme: any) => ({
                borderRadius: '20px',
                padding: '12px 8px',
                width: '100%',
                mt: '20px',
                marginBottom: 10,
                display: 'flex',
                justifyContent: 'space-around',
                flexWrap: {
                  xs: 'wrap',
                  md: 'nowrap',
                },

                gap: {
                  xs: '8px',
                  md: '20px',
                },
              })}
            >
              <Box
                sx={{
                  flex: { xl:4 },
                  display: 'flex',
                  flexWrap: {
                    xs: 'wrap',
                    md: 'nowrap',
                  },
                  justifyContent: {
                    xs: 'center',
                    sm: 'space-between',
                  },
                  width: {
                    xs: '100%',
                    md: '70%',
                  },
                  gap: {
                    xs: '',
                    md: 5,
                    xl: 20,
                  },
                }}
              >
                {/* Employee Composition */}

                <Box
                  sx={{
                    marginBottom: {
                      xs: 10,
                      sm: 0,
                    },

                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <Typography
                      variant='h6'
                      sx={{ fontWeight: 600, marginBottom: 2 }}
                    >
                      {t('Employee Composition')}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      mt: '28px',
                      gap: {
                        xs: '10px',
                        md: '30px',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: '150px',
                        width: '150px',
                      }}
                    >
                      <PieChart
                        data={preparePieChartData([
                          {
                            key: <MaleIcon /> || t('male'),
                            value: hrkpis.totalMaleEmployees || 0,
                            color: '#37D310',
                          },
                          {
                            key: <FemaleIcon /> || t('female'),
                            value: hrkpis.totalFemaleEmployees || 0,
                            color: '#964CF5',
                          },
                        ])}
                      />
                    </Box>
                    <Box>
                      <Typography
                        className='smallBody'
                        sx={{
                          opacity: 0.7,
                          textAlign: {
                            xs: 'center',
                            md: 'start',
                          },
                        }}
                      >
                        {hrkpis.totalEmployees} {t('employee total')}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Top Skills */}

                <Box
                  sx={{
                    width: {
                      xs: '100%',
                      sm: '50%',
                      xl: '45%'
                    },

                    marginBottom: {
                      xs: 10,
                      sm: 0,
                    },

                    marginRight: {
                      xs: 0,
                      md: 5,
                      xl: 10,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 600,
                      marginBottom: 2,
                      textAlign: { xs: 'center', md: 'start' },
                    }}
                  >
                    {t('Top 10 Skills')}
                  </Typography>
                  {topSkills &&
                    topSkills?.map((item: any) => {
                      return (
                        <>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Box>
                              <Typography sx={{ fontSize: '14px', fontWeight: '400' }}>
                                {t(`${item?.skill}`)}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center',
                              }}
                            >
                              <Typography className='smallBody'>
                                {t(`${item?.percentage}`)}
                              </Typography>

                              <Box
                                sx={{
                                  height: '80px',
                                  width: '130px',
                                }}
                              >
                                <ProgressiveChart summary={item?.summary} />
                              </Box>
                            </Box>
                          </Box>
                        </>
                      );
                    })}
                </Box>
              </Box>

              {/* Certificates Section */}

              <Box
                sx={{
                  flex:{ xl:1},
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                  width: {
                    xs: '100%',
                    md: '30%',
                  },
                  textAlign: {
                    xs: 'center',
                    md: 'start',
                  },
                }}
              >
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      marginBottom: 2,
                      justifyContent: {
                        xs: 'center',
                        md: 'start',
                      },
                    }}
                  >
                    <Typography
                      variant='h6'
                      sx={{
                        fontWeight: 600,
                        textAlign: { xs: 'center', md: 'start' },
                      }}
                    >
                      {t('Total Employees')}
                    </Typography>

                    {certificateData === null ||
                    certificateData?.employeeChangePercent === '0.00%' ? (
                      <></>
                    ) : (
                      <>
                        <Box
                          sx={{
                            backgroundColor: `${
                              employeeIncrease ? '#27AE6026' : '#EB575726'
                            }`,
                            borderRadius: '30px',
                            padding: '0px 10px',
                            color: `${
                              employeeIncrease ? '#27AE60' : '#EB5757'
                            }`,
                          }}
                        >
                          <img
                            src={
                              employeeIncrease ? Increase_Icon : Decrease_Icon
                            }
                            alt=''
                          />{' '}
                          {certificateData?.employeeChangePercent}
                        </Box>
                      </>
                    )}
                  </Box>

                  <Typography
                    variant='h6'
                    sx={{ fontWeight: 600, marginBottom: 1 }}
                  >
                    {t(`${certificateData?.totalEmployees || 0}`)}
                  </Typography>

                  <Typography className='smallBody' sx={{ opacity: 0.7 }}>
                    {t('employees')}
                  </Typography>
                </Box>

                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      marginBottom: 2,
                      justifyContent: {
                        xs: 'center',
                        md: 'start',
                      },
                    }}
                  >
                    <Typography
                      variant='h6'
                      sx={{
                        fontWeight: 600,
                        textAlign: { xs: 'center', md: 'start' },
                      }}
                    >
                      {t('Certificate Renewal')}
                    </Typography>

                    {certificateData === null ||
                    certificateData?.certificateChangePercent === '0.00%' ? (
                      <></>
                    ) : (
                      <>
                        <Box
                          sx={{
                            backgroundColor: `${
                              certificateIncrease ? '#27AE6026' : '#EB575726'
                            }`,
                            borderRadius: '30px',
                            padding: '0px 10px',
                            color: `${
                              certificateIncrease ? '#27AE60' : '#EB5757'
                            }`,
                          }}
                        >
                          <img
                            src={
                              certificateIncrease
                                ? Increase_Icon
                                : Decrease_Icon
                            }
                            alt=''
                          />{' '}
                          {certificateData?.certificateChangePercent}
                        </Box>
                      </>
                    )}
                  </Box>

                  <Typography
                    variant='h6'
                    sx={{ fontWeight: 600, marginBottom: 1 }}
                  >
                    {t(`${certificateData?.certificatesPendingRenewal || 0}`)}
                  </Typography>

                  <Typography className='smallBody' sx={{ opacity: 0.7 }}>
                    {t('Certificates')}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: {
                  xs: 'wrap',
                  md: 'nowrap',
                },
                gap: 10,
              }}
            >
              <Box
                sx={{
                  width: {
                    xs: '100%',
                    md: '60%',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 2,
                  }}
                >
                  <Typography
                    variant='h6'
                    sx={{ fontWeight: 600, marginBottom: 2 }}
                  >
                    {t('Leaves Statistics')}
                  </Typography>

                  <Dropdown setIsMonthlyLeaves={setIsMonthlyLeaves} />
                </Box>

                <Barchart
                  leaves={leaves}
                  isMonthlyLeaves={isMonthlyLeaves}
                  width={width}
                />
              </Box>
              <Box
                sx={{
                  width: {
                    xs: '100%',
                    md: '30%',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 5,
                  }}
                >
                  <Typography variant='h6' sx={{ fontWeight: 600 }}>
                    {t('Skills')}
                  </Typography>
                </Box>

                {expoertise &&
                  expoertise?.map((item: any, index: number) => {
                    let percent = parsePercentage(item?.percentage);

                    return (
                      <>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            justifyContent: 'start',
                            borderBottom: '1px solid lightgrey',
                          }}
                        >
                          <Box
                            sx={{
                              height: '10px',
                              width: '15px',
                              borderRadius: '50%',
                              backgroundColor: item.agendaColor,
                            }}
                          ></Box>

                          <Box
                            sx={{
                              width: {
                                xs: 150,
                                md: 120,
                                lg: 200,
                              },
                            }}
                          >
                            <Typography>
                              {item.expertiseName}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              width: '100%',
                            }}
                          >
                            <Progressbar
                              percent={percent}
                              color={item.agendaColor}
                            />
                          </Box>
                        </Box>
                      </>
                    );
                  })}
              </Box>
            </Box>
          </div>
        </>
      )}
    </>
  );
}

export default Dashboard;
