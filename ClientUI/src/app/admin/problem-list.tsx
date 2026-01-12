import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    type PaginationState,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { capitalizeFirstLetter } from '@/lib/helpers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Difficulty, type IProblem } from '../problems-list';
import { CompanyLogos } from '../company-logo';

const columnHelper = createColumnHelper<IProblem>();

const columns = [
    columnHelper.accessor(row => row.title, {
        id: 'title',
        size: 800,
        cell: info => <p className='font-medium'>{info.getValue()}</p>,
        header: () => <span>Title</span>,
    }),
    columnHelper.accessor(row => row.visibility, {
        id: 'visibility',
        cell: info => <p>{capitalizeFirstLetter(info.getValue())}</p>,
        header: () => <span>Visibility</span>,
    }),
    columnHelper.accessor(row => row.difficulty, {
        id: 'difficulty',
        cell: info => <p className={getDifficultyClass(info.getValue())}>{capitalizeFirstLetter(info.getValue())}</p>,
        header: () => <span>Difficulty</span>,
    }),
    columnHelper.accessor(row => row.company, {
        id: 'company',
        cell: info => <CompanyLogos companies={info.getValue()} />,
        header: () => <span>Company</span>,
    }),
]

export const getDifficultyClass = (difficulty: string) => {
    return {
        [Difficulty.Easy]: 'text-green-600 dark:text-green-400',
        [Difficulty.Medium]: 'text-yellow-600 dark:text-yellow-400',
        [Difficulty.Hard]: 'text-red-600 dark:text-red-400',
    }[difficulty];
};

export const AdminProblemTable = ({ problems, onClickHandler }: { problems: IProblem[], onClickHandler: (id: string) => void }) => {
    const [data, _setData] = useState(() => [...problems]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        manualPagination: true,
    });

    useEffect(() => {
        _setData([...problems]);
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, [problems]);

    return (
        <div className="p-2">
            <Table>
                <TableBody>
                    {table.getRowModel().rows.map(row => (
                        <TableRow
                            onClick={() => onClickHandler(row.original.id)}
                            key={row.id}
                            className="cursor-pointer"
                        >
                            {row.getVisibleCells().map(cell => (
                                <TableCell style={{ width: cell.column.getSize() }} key={cell.id} onClick={() => onClickHandler(row.original.id)}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>

                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-end items-center space-x-2 mt-5">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </Button>
                <span className="flex items-center gap-1 text-sm">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount().toLocaleString()}
                    </strong>
                </span>
                <span className="flex items-center gap-1 text-sm">
                    | Go to page:
                    <Input
                        type="number"
                        min="1"
                        max={table.getPageCount()}
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            table.setPageIndex(page)
                        }}
                        className="w-16 h-8"
                    />
                </span>
                <Select
                    value={table.getState().pagination.pageSize.toString()}
                    onValueChange={(value) => {
                        table.setPageSize(Number(value))
                    }}
                >
                    <SelectTrigger className="h-8 w-[120px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <SelectItem key={pageSize} value={pageSize.toString()}>
                                Show {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div >
    )
}