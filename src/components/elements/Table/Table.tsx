import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { ThemeProvider } from "@emotion/react";
import { createTheme, useTheme } from "@mui/material";
import { useMemo } from "react";

interface ITableProps {
  columns: any[];
  data: any[];
  isLoading: boolean;
}

const Table = ({ columns, data, isLoading }: ITableProps) => {
  const globalTHeme = useTheme();
  const defaultTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "dark",
          primary: {
            main: "#000000",
          },
          secondary: {
            // White color
            main: "#FFFFFF",
          },
        },
        components: {
          MuiInput: {
            styleOverrides: {
              root: {
                backgroundColor: "#00000",
              },
            },
          },
        },
      }),
    [globalTHeme],
  );
  return (
    <ThemeProvider theme={defaultTheme}>
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
