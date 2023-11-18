import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { ThemeProvider } from "@emotion/react";
import { theme } from "@/utils/theme";

interface ITableProps {
  columns: any[];
  data: any[];
  isLoading: boolean;
}

const Table = ({ columns, data, isLoading }: ITableProps) => {
  return (
    <ThemeProvider theme={theme}>
      <MaterialReactTable
        data={data}
        columns={columns}
        localization={MRT_Localization_ES}
        state={{ isLoading }}
      />
    </ThemeProvider>
  );
};

export default Table;
