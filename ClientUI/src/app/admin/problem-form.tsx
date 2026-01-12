import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import TestcaseInput from './testcase-input';
import MarkdownEditor from './markdown-editor';
import { tryCatch } from '@/lib/try-catch';
import { addProblemService, editProblemService, getProblemByIdService } from '@/services/problems.service';
import { toast } from 'sonner';
import { getCompaniesService } from '@/services/company.service';
import type { ICompany } from '../problems-list';
import { useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import { useLocation, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
    title: z.string("Title is required").min(2, "Title must be at least 2 characters long").max(100, "Title must be 100 characters long"),
    description: z.string("Description is required"),
    difficulty: z.enum(["easy", "medium", "hard"], "Difficulty must be one of easy, medium or hard"),
    editorial: z.string().optional(),
    visibility: z.enum(["public", "private"], "Visibility must be one of public or private"),
    company: z.array(z.object({
        value: z.string(),
        label: z.string()
    })),
    testcases: z.array(z.object({
        id: z.string().optional(),
        input: z.string("Input is required"),
        output: z.string("Output is required")
    }))
        .min(1, "Testcases length must be at least 1")
        .transform(testcases => {
            return testcases.map(testcase => {
                const obj = { ...testcase };
                if (obj.id === '') {
                    delete obj.id;
                }
                return obj;
            });
        }),
    stub: z.string("Stub is required"),
    driver_code: z.string("Stub is required")
});

export type ProblemForm = z.infer<typeof formSchema>;

type ProblemFormProps = {
    onSubmit?: () => void;
}

type ProblemPayload = Omit<ProblemForm, "company"> & {
  company: string[];
};

const ProblemForm = ({ onSubmit }: ProblemFormProps) => {
    const form = useForm<ProblemForm>({
        defaultValues: {
            testcases: [{
                id: "",
                input: "",
                output: ""
            }]
        },
        resolver: zodResolver(formSchema)
    });
    const location = useLocation();
    const [problemId, setProblemId] = useState<string | null>();
    const [companies, setCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const getCompaniesHandler = async () => {
        const [data, error] = await tryCatch(() => getCompaniesService());
        if (error) {
            toast.error("Oops, An error occurred!", {
                description: error,
                closeButton: true,
            });
        }
        else {
            const companiesData = data?.data?.data?.companies || [];
            const companiesDataOptions = companiesData.map((company: ICompany) => ({ value: company.id, label: company.name }))
            setCompanies(companiesDataOptions);
        }
    }

    const handleSubmit = async (data: ProblemForm) => {
        console.log(data)
        setIsSubmitting(true);
        const payload: ProblemPayload = {
            ...data,
            company: (data.company as { value: string; label: string }[]).map(c => c.value)
        }
        const [_, error] = await tryCatch(() => problemId ? editProblemService(problemId, payload) : addProblemService(payload));
        setIsSubmitting(false);
        if (error) {
            toast.error("Oops, An error occurred!", {
                description: error,
                closeButton: true,
            });
        } else {
            toast.success("Success!", {
                description: `Problem ${problemId ? 'updated' : 'created'} successfully`,
                closeButton: true,
            });
            form.reset();
            onSubmit?.();
            onSubmit?.();
        }
    }

    const getProblemByIdHandler = async () => {
        setIsLoading(true);
        const [data, error] = await tryCatch(() => getProblemByIdService(problemId as string));
        setIsLoading(false);
        if (error) {
            toast.error("Oops, An error occurred!", {
                description: error,
                closeButton: true,
            });
        }
        else {
            const res = data?.data?.data;
            console.log(res)
            const formData = {
                ...res,
                company: res.company.map((company: ICompany) => ({ value: company.id, label: company.name }))
            }
            form.reset(formData);
        }
    }

    const goBackHandler = () => {
        navigate(-1);
    }

    useEffect(() => {
        getCompaniesHandler();
    }, []);

    useEffect(() => {
        if (problemId) {
            getProblemByIdHandler();
        }
    }, [problemId]);

    useEffect(() => {
        if (location.state?.problemId) {
            setProblemId(location.state.problemId);
        }
    }, []);

    return (
        <div className='gap-2'>
            <h1 className='text-xl font-medium mb-5 flex gap-3 items-center'><ArrowLeft onClick={goBackHandler} />{problemId ? 'Edit' : 'Add'} Problem</h1>
            <div>
                {isLoading && <div>Loading...</div>}
                {!isLoading && <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <FieldGroup className='gap-4'>
                        <div className='grid grid-cols-2 gap-5'>
                            <Field>
                                <FieldLabel>Title</FieldLabel>
                                <Controller
                                    name="title"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter problem title"
                                        // disabled={isSubmitting}
                                        />
                                    )}
                                />
                                <FieldError>{form.formState.errors.title?.message}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel>Company</FieldLabel>
                                <Controller
                                    name="company"
                                    control={form.control}
                                    render={({ field }) => (
                                        <ReactSelect value={field.value} options={companies} onChange={field.onChange} isMulti />
                                    )}
                                />
                                <FieldError>{form.formState.errors.company?.message}</FieldError>
                            </Field>
                        </div>
                        <div className='grid grid-cols-2 gap-5'>
                            <Field>
                                <FieldLabel>Description</FieldLabel>
                                <Controller
                                    name="description"
                                    control={form.control}
                                    render={({ field }) => (
                                        <MarkdownEditor content={field.value} setContent={field.onChange} />
                                    )}
                                />
                                <FieldError>{form.formState.errors.description?.message}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel>Editorial</FieldLabel>
                                <Controller
                                    name="editorial"
                                    control={form.control}
                                    render={({ field }) => (
                                        <MarkdownEditor content={field.value} setContent={field.onChange} />
                                    )}
                                />
                                <FieldError>{form.formState.errors.editorial?.message}</FieldError>
                            </Field>
                        </div>

                        <div className='flex items-center gap-5'>
                            <Field>
                                <FieldLabel>Difficulty</FieldLabel>
                                <Controller
                                    name="difficulty"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={(e) => field.onChange(e)}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select difficulty level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Difficulty Level</SelectLabel>
                                                    <SelectItem value="easy">Easy</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="hard">Hard</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FieldError>{form.formState.errors.difficulty?.message}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel>Visibility</FieldLabel>
                                <Controller
                                    name="visibility"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={(e) => field.onChange(e)}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select visibility" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Visibility</SelectLabel>
                                                    <SelectItem value="public">Public</SelectItem>
                                                    <SelectItem value="private">Private</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FieldError>{form.formState.errors.visibility?.message}</FieldError>
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Testcases</FieldLabel>
                            <Controller
                                name="testcases"
                                control={form.control}
                                render={({ field }) => (
                                    <TestcaseInput testcases={field.value} setTestcases={field.onChange} />
                                )}
                            />
                            <FieldError>{form.formState.errors.testcases?.message}</FieldError>
                        </Field>

                        <div className='flex items-center gap-5'>
                            <Field>
                                <FieldLabel>Stub</FieldLabel>
                                <Controller
                                    name="stub"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Textarea {...field} placeholder='Enter problem stub' />
                                    )}
                                />
                                <FieldError>{form.formState.errors.stub?.message}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel>Driver Code</FieldLabel>
                                <Controller
                                    name="driver_code"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Textarea {...field} placeholder='Enter driver code' />
                                    )}
                                />
                                <FieldError>{form.formState.errors.stub?.message}</FieldError>
                            </Field>
                        </div>
                    </FieldGroup>

                    <div className="flex gap-3 mt-5">
                        <Button
                            type="submit"
                            // disabled={isSubmitting}
                            className="flex-1"
                        >
                            {isSubmitting ? (
                                <>
                                    {problemId ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>
                                    {problemId ? 'Update problem' : 'Create problem'}
                                </>
                            )}
                        </Button>
                        {/* {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                        )} */}
                    </div>
                </form>}
            </div>
        </div >
    )
}

export default ProblemForm