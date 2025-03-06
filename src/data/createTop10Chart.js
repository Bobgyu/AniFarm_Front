import Highcharts from "highcharts";

const createTop10Chart = (containerId, rawData) => {
  // 데이터 형식 변환
  const formattedData = {
    categories: rawData.map((item) => item.category),
    previousYearData: rawData.map(
      (item) => parseInt(item.previous_year) / 1000
    ), // 백만원 단위로 변환
    currentYearData: rawData.map((item) => parseInt(item.base_date) / 1000), // 백만원 단위로 변환
  };

  // console.log("변환된 데이터:", formattedData); // 디버깅용

  return Highcharts.chart(containerId, {
    chart: {
      type: "column",
    },
    title: {
      text: "[2024년 1월 1주차 ~ 2024년 12월 4주차] 매출 TOP 10입니다.]",
      align: "center",
    },
    xAxis: {
      categories: formattedData.categories,
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: "매출액(백만원)",
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f}백만원</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
      bar: {
        dataLabels: {
          enabled: true,
          format: "{point.y:.1f}",
        },
      },
    },
    series: [
      {
        name: "전년동기",
        data: formattedData.previousYearData,
      },
      {
        name: "기준일",
        data: formattedData.currentYearData,
      },
    ],
  });
};

export const createTop5Chart = (containerId, rawData) => {
  // 데이터 형식 변환
  const formattedData = {
    categories: rawData.map((item, index) => `${index + 1}위 ${item.category}`),
    previousYearData: rawData.map(
      (item) => parseInt(item.previous_year) / 1000
    ),
    currentYearData: rawData.map((item) => parseInt(item.base_date) / 1000),
  };

  return Highcharts.chart(containerId, {
    chart: {
      type: "bar",
      backgroundColor: "#C6CBC9",
      height: 500, // 차트 높이 설정
      width: 600, // 차트 너비 설정
    },
    title: {
      text: "한눈에 보는 소비트렌드 TOP 5",
      align: "left",
      style: {
        color: "#333333",
        fontSize: "18px",
        fontWeight: "bold",
      },
    },
    xAxis: {
      categories: formattedData.categories,
      crosshair: true,
      labels: {
        style: {
          color: "#333333",
          fontSize: "12px",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "매출액(백만원)",
        style: {
          color: "#333333",
        },
      },
      labels: {
        style: {
          color: "#333333",
        },
      },
    },
    plotOptions: {
      bar: {
        pointPadding: 0.2,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: "{point.y:.1f}",
          style: {
            color: "#333333",
          },
        },
        colors: ["#4572A7", "#AA4643"], // 시리즈별 색상 지정
      },
    },
    legend: {
      itemStyle: {
        color: "#333333",
      },
    },
    series: [
      {
        name: "전년동기",
        data: formattedData.previousYearData,
        color: "#4572A7",
      },
      {
        name: "기준일",
        data: formattedData.currentYearData,
        color: "#AA4643",
      },
    ],
    credits: {
      enabled: false, // Highcharts 워터마크 제거
    },
  });
};

export default createTop10Chart;
