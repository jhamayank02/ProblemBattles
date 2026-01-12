import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { tryCatch } from '@/lib/try-catch';
import { addCompanyService, updateCompanyService } from '@/services/company.service';
import { toast } from 'sonner';
import { UploadIcon } from 'lucide-react';
import type { ICompany } from '../problems-list';

const formSchema = z.object({
    name: z.string({ message: "Company name is required" }).min(1, "Company name cannot be empty"),
    image_url: z.string().optional(),
    // image_url: z.instanceof(FileList).optional().refine((files) => !files || files.length === 0 || files[0]?.size <= 5 * 1024 * 1024, "Image size must be less than 5MB")
    //     .refine((files) => !files || files.length === 0 || ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(files[0]?.type), "Only JPEG, PNG, and WebP images are allowed"),
});

type CompanyFormData = z.infer<typeof formSchema>;

interface CompanyFormProps {
    onSubmit?: () => void;
    onCancel?: () => void;
    isSubmitting?: boolean;
    company?: ICompany;
}

const CompanyForm = ({ onSubmit, onCancel, isSubmitting = false, company }: CompanyFormProps) => {
    const isEditing = !!company;

    const form = useForm<CompanyFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: company?.name || "",
            image_url: company?.image_url || "",
        }
    });

    const handleSubmit = async (data: CompanyFormData) => {
        // Default submit handler
        // const formData = new FormData();
        // formData.append('name', data.name);
        // if (data.image && data.image.length > 0) {
        //     formData.append('image', data.image[0]);
        // }

        const [_, error] = await tryCatch(() => isEditing ? updateCompanyService(company.id, {
            ...data,
            image_url: data.image_url || undefined
        }) : addCompanyService(data));
        if (error) {
            toast.error("Oops, An error occurred!", {
                description: error,
                closeButton: true,
            });
        } else {
            toast.success("Success!", {
                description: `Company ${isEditing ? 'updated' : 'created'} successfully`,
                closeButton: true,
            });
            form.reset();
            onCancel?.();
            onSubmit?.();
        }
    };

    return (
        <form onSubmit={form.handleSubmit(handleSubmit)}>
            <h1 className='text-xl font-medium mb-5'>{isEditing ? 'Edit Company' : 'Add Company'}</h1>
            <FieldGroup className='gap-4'>
                <Field>
                    <FieldLabel>Company Name</FieldLabel>
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Enter company name"
                                disabled={isSubmitting}
                            />
                        )}
                    />
                    <FieldError>{form.formState.errors.name?.message}</FieldError>
                </Field>

                <Field>
                    <FieldLabel>Company Logo <span className="text-muted-foreground">(Optional)</span></FieldLabel>
                    <Controller
                        name="image_url"
                        control={form.control}
                        render={({ field: { onChange, value, ...field } }) => (
                            <div className="space-y-2">
                                <Input
                                    {...field}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    onChange={(e) => onChange(e.target.files)}
                                    disabled={isSubmitting}
                                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Upload a company logo (optional, JPEG, PNG, WebP, max 5MB)
                                </p>
                            </div>
                        )}
                    />
                    <FieldError>{form.formState.errors.image_url?.message}</FieldError>
                </Field>
            </FieldGroup>

            <div className="flex gap-3 mt-5">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                >
                    {isSubmitting ? (
                        <>
                            <UploadIcon className="h-4 w-4 animate-spin mr-2" />
                            Creating...
                        </>
                    ) : (
                        <>
                            <UploadIcon className="h-4 w-4 mr-2" />
                            {isEditing ? 'Update Company' : 'Create Company'}
                        </>
                    )}
                </Button>
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
};

export default CompanyForm;