import { tryCatch } from '@/lib/try-catch';
import { getCompaniesService, searchCompanyService } from '@/services/company.service';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import type { ICompany } from '../problems-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { CompanyTable } from './companies-table';
import CompanyForm from './company-form';
import { useDebounce } from '@/lib/helpers';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '../spinner/loading-spinner';

const AdminCompaniesPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [companies, setCompanies] = useState<ICompany[]>();
    const [filteredCompanies, setFilteredCompanies] = useState<ICompany[]>();
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [isSubmitting] = useState(false);
    const [editingCompany, setEditingCompany] = useState<ICompany | null>(null);
    const [query, setQuery] = useState<string>("");
    const debouncedQuery = useDebounce(query, 500);

    const getCompaniesHandler = async () => {
        setIsLoading(true);
        const [data, error] = await tryCatch(() => getCompaniesService());
        setIsLoading(false);
        if (error) {
            toast.error("Oops, An error occurred!", {
                description: error,
                closeButton: true,
            });
        }
        else {
            const companiesData = data?.data?.data?.companies || [];
            setCompanies(companiesData);
            setFilteredCompanies(companiesData);
        }
    }

    const handleEditCompany = (company: ICompany) => {
        setEditingCompany(company);
        setIsFormDialogOpen(true);
    };

    const handleCloseFormDialog = () => {
        setIsFormDialogOpen(false);
        setEditingCompany(null);
    };

    const handleSearchChange = (value: string) => {
        setQuery(value);
    }

    const searchCompaniesHandler = async () => {
        if (!query) {
            return;
        }
        setIsLoading(true);
        const [data, error] = await tryCatch(() => searchCompanyService(query));
        setIsLoading(false);
        if (error) {
            toast.error("Oops, An error occurred!", {
                description: error,
                closeButton: true,
            });
        }
        else {
            setFilteredCompanies(data?.data?.data?.companies || []);
        }
    }

    useEffect(() => {
        getCompaniesHandler();
    }, []);


    useEffect(() => {
        if (debouncedQuery.trim()) {
            searchCompaniesHandler();
        } else {
            setFilteredCompanies(companies);
        }
    }, [debouncedQuery, companies]);

    return (
        <section>
            {isLoading && <div className="mt-20 items-center justify-center"><LoadingSpinner size="md" message="Loading companies..." /></div>}

            {!isLoading && <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Companies</CardTitle>
                        <CardDescription>Manage companies</CardDescription>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingCompany(null);
                            setIsFormDialogOpen(true);
                        }}
                        variant='outline'
                        className="flex items-center gap-2"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Create Company
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className='flex gap-5 items-center'>
                        <Input value={query} onChange={(e) => handleSearchChange(e.target.value)} placeholder='Search companies' />
                    </div>
                    {isLoading && <p>Loading companies...</p>}
                    {!isLoading && (
                        filteredCompanies && filteredCompanies?.length > 0 ? <CompanyTable companies={filteredCompanies} onClickHandler={() => { }} onEditHandler={handleEditCompany} /> : <div className='py-5'>
                            <p className='text-sm text-center'>No companies found.</p>
                        </div>
                    )}
                </CardContent>
            </Card>}

            {isFormDialogOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                        <CompanyForm
                            onSubmit={getCompaniesHandler}
                            onCancel={handleCloseFormDialog}
                            isSubmitting={isSubmitting}
                            company={editingCompany || undefined}
                        />
                    </div>
                </div>
            )}
        </section>
    )
}

export default AdminCompaniesPage