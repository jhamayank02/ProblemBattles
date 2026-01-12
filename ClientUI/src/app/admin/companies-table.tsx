import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    type PaginationState,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreHorizontal, Edit } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ICompany } from '../problems-list';

const columnHelper = createColumnHelper<ICompany>();

const columns = [
    columnHelper.accessor(row => row.name, {
        id: 'name',
        cell: info => <div className='flex gap-5 items-center'>
            <div
                className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-xs shadow-sm hover:z-10 hover:scale-110 transition-transform cursor-pointer"
                title={info.row.original.name}
            >
                {info.row.original.image_url ? (
                    <img
                        src={info.row.original.image_url}
                        alt={info.row.original.name}
                        className="h-full w-full rounded-full object-cover"
                    />
                ) : (
                    <span>{info.row.original.name.substring(0, 1).toUpperCase()}</span>
                )}
            </div>
            <p className='font-medium'>{info.getValue()}</p>
        </div>,
        size: 1000,
        header: () => <span>Name</span>,
    }),
    columnHelper.display({
        id: 'actions',
        cell: (info) => {
            const onEditHandler = (info.table.options.meta as any)?.onEditHandler;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditHandler?.(info.row.original)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        header: () => <span>Actions</span>,
    }),
]

export const CompanyTable = ({ companies, onClickHandler, onEditHandler }: { companies: ICompany[], onClickHandler: (id: string) => void, onEditHandler: (company: ICompany) => void }) => {
    const [data, _setData] = useState(() => [...companies]);
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
        meta: {
            onEditHandler,
        },
    });

    useEffect(() => {
        _setData([...companies]);
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, [companies]);

    return (
        <div className="p-2">
            <Table>
                <TableBody>
                    {table.getRowModel().rows.map(row => (
                        <TableRow
                            key={row.id}
                            // onClick={() => onSelectProblem(problem.id)}
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