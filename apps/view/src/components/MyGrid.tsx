import {
    DataGrid,
    GridRowsProp,
    GridEventListener,
    GridEvents,
    GridColDef,
    GridToolbar,
    GridCellParams,
    MuiEvent
} from '@mui/x-data-grid';


interface Props {
    rows: GridRowsProp;
    columns: GridColDef[],
    getRowId: any,
    loading: boolean,
    sx: any,
    onCellDoubleClickHandler?: any;
}
function MyGrid({ rows, columns, getRowId, loading, sx, onCellDoubleClickHandler = undefined }: Props): JSX.Element {

    return (

        <DataGrid
            density='compact'
            columns={columns}
            rows={rows}
            getRowId={getRowId}
            pageSize={100}
            loading={loading}
            sx={{ color: '#eee' }}

            onCellDoubleClick={(params: GridCellParams, event: MuiEvent<React.MouseEvent>) => {
                if (onCellDoubleClickHandler !== undefined) {
                    event.defaultMuiPrevented = true;
                    onCellDoubleClickHandler(params);
                }
            }}
            components={{
                Toolbar: GridToolbar,
            }}
        />
    );
}

MyGrid.defaultProps = {
    rows: null,
    columns: null,
    getRowId: null,
    loading: null,
    pageSize: 100,
    sx: null
};

export default MyGrid;
