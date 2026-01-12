import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router';
import { tryCatch } from '@/lib/try-catch';
import { registerUserService } from '@/services/auth.service';
import { toast } from 'sonner';
import { CodeIcon } from 'lucide-react';

const formSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    username: z.string({ message: "Username is required" }).min(2, "Username must be atleast 2 characters long"),
    password: z.string({ message: "Password is required" }).min(8, "Password must be atleast 8 characters long"),
    confirmPassword: z.string({ message: "Confirm password is required" })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password not matched",
    path: ['confirmPassword']
});

const Signup = () => {
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
            confirmPassword: ""
        }
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const [_, error] = await tryCatch(() => registerUserService(data));
        if (error) {
            toast.error("Oops, An error occurred!", {
                description: error,
                closeButton: true,
            });
        }
        else {
            toast.success("Success!", {
                description: "Account created successfully",
                closeButton: true,
            });
            navigate('/auth');
        }
    }

    return (
        <Card className="w-full sm:max-w-md gap-1">
            <CardHeader>
                <CardTitle className='text-2xl text-center mb-5 flex gap-2 items-center justify-center'>
                    <CodeIcon className="h-6 w-6" />
                    <span>ProblemBattles</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className='gap-3'>
                        {/* Username input */}
                        <Controller
                            name='username'
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor='username'>
                                        Username
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id='username'
                                        aria-invalid={fieldState.invalid}
                                        placeholder='Enter your username'
                                        autoComplete='off'
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        {/* Email input */}
                        <Controller
                            name='email'
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor='email'>
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id='email'
                                        aria-invalid={fieldState.invalid}
                                        placeholder='Enter your email address'
                                        autoComplete='off'
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        {/* Password input */}
                        <Controller
                            name='password'
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor='password'>
                                        Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id='password'
                                        aria-invalid={fieldState.invalid}
                                        placeholder='Enter your password'
                                        autoComplete='off'
                                        type='password'
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        {/* Confirm password input */}
                        <Controller
                            name='confirmPassword'
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor='confirmPassword'>
                                        Confirm Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id='password'
                                        aria-invalid={fieldState.invalid}
                                        placeholder='Confirm your password'
                                        autoComplete='off'
                                        type='password'
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                    <Field orientation='vertical' className='mt-5'>
                        <Button type="submit" variant="default">Sign up</Button>
                        <Link to='/auth'><Button className='w-full' type="button" variant="link">Already have an account?</Button></Link>
                    </Field>
                </form>
            </CardContent>
        </Card>
    )
}

export default Signup;