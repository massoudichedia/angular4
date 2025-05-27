export interface ChartOptions {
  series: {
    name: string;
    data: number[];
  }[];
  chart: {
    type: string;
    height: number;
    animations?: {
      enabled: boolean;
      easing: string;
      speed: number;
    };
  };
  colors: string[];
  plotOptions?: {
    bar?: {
      horizontal?: boolean;
      columnWidth?: string;
      endingShape?: string;
    };
  };
  dataLabels?: {
    enabled: boolean;
  };
  stroke?: {
    show?: boolean;
    width?: number;
    colors?: string[];
    curve?: string;
  };
  markers?: {
    size?: number;
    hover?: {
      size?: number;
    };
  };
  xaxis: {
    categories: string[];
  };
  fill?: {
    opacity?: number;
  };
  tooltip?: {
    y?: {
      formatter?: (val: number) => string;
    };
  };
}