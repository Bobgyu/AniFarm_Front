import Highcharts from "highcharts";

const createTop10Chart = (containerId, data) => {
  return Highcharts.chart(containerId, {
    chart: {
      type: "column",
    },
    title: {
      text: "[2024년 1월 1주차 ~ 2025년 3월 1주차] 매출 TOP 10",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    xAxis: {
      categories: data.map(item => item.crop_name),
      labels: {
        style: {
          fontSize: "13px",
        },
      },
    },
    yAxis: {
      title: {
        text: "매출액(천원)",
        style: {
          fontSize: "13px",
        },
      },
      labels: {
        formatter: function() {
          return Highcharts.numberFormat(this.value, 0, "", ",");
        },
      },
    },
    tooltip: {
      formatter: function() {
        return `<b>${this.x}</b><br/>
                ${this.series.name}: ${Highcharts.numberFormat(this.y, 0, "", ",")}천원`;
      },
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          formatter: function() {
            return Highcharts.numberFormat(this.y, 0, "", ",");
          },
          style: {
            fontSize: "12px",
          },
        },
      },
      series: {
        pointWidth: 40,
      },
    },
    legend: {
      align: "center",
      verticalAlign: "bottom",
      layout: "horizontal",
      itemStyle: {
        fontSize: "13px",
      },
    },
    series: [
      {
        name: "전년동기",
        data: data.map(item => item.previous_year),
        color: "#7CB5EC",
      },
      {
        name: "기준일",
        data: data.map(item => item.current_year),
        color: "#0aab65",
      },
    ],
    credits: {
      enabled: false,
    },
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
