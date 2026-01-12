import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router';
import { tryCatch } from '@/lib/try-catch';
import { loginUserService } from '@/services/auth.service';
import { toast } from 'sonner';
import { useContext } from 'react';
import { AuthContext } from '@/context/auth-context';
import { CodeIcon } from 'lucide-react';

const formSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string({ message: "Password is required" }).min(8, "Password must be atleast 8 characters long"),
});

const Login = () => {
    const navigate = useNavigate();
    const ctx = useContext(AuthContext);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const [res, error]: [any, any] = await tryCatch(() => loginUserService(data));
        if (error || !res) {
            toast.error("Oops, An error occurred!", {
                description: error,
                closeButton: true,
            });
        }
        else {
            ctx.setUser(res?.data?.data?.user, res?.data?.data?.roles);
            toast.success("Success!", {
                description: "Logged in successfully",
                closeButton: true,
            });
            navigate('/');
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
                    </FieldGroup>
                    <Field orientation='vertical' className='mt-5'>
                        <Button type="submit" variant="default">Login</Button>
                        <Link to='/auth/signup'><Button className='w-full' type="button" variant="link">Don't have an account?</Button></Link>
                    </Field>
                </form>
            </CardContent>
        </Card>
    )
}

export default Login;