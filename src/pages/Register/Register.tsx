import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Input from 'src/components/Input'
import { useMutation } from '@tanstack/react-query'
import { schema, Schema } from 'src/utils/ruleValidateForm'
import { yupResolver } from '@hookform/resolvers/yup'
import { registerAccount } from 'src/apis/auth.api'
import { omit } from 'lodash'
import { isAxiosStatusCodeError } from 'src/utils/utilsErrForm'
import { ErrorResponse } from 'src/types/utils.type'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
import path from 'src/constants/path'

type FormData = Schema
export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })
  // gọi func API
  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => registerAccount(body)
  })
  const handleOnSubmit = handleSubmit((data) => {
    // loại bỏ trường confirm_password
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      // nếu thành công thì:
      onSuccess: (data) => {
        // nếu thành công thì set nó thành setIsAuthenticated=true và vào mainlayout
        setIsAuthenticated(true)
        // và setProfile data User vào localStorage
        setProfile(data.data.data.user)
        navigate(path.home)
      },
      onError: (error) => {
        if (isAxiosStatusCodeError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          // nếu là 1 FormDataError thì nên dùng forEach để set cho từng keyError
          if (formError) {
            Object.keys(formError).forEach((key) => {
              // convert from Object formError to key
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-5 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='m-4 rounded bg-white p-10 shadow-lg' onSubmit={handleOnSubmit} noValidate>
              <div className='text-2xl'>Đăng ký</div>
              <Input
                className='mt-8'
                errors={errors.email?.message}
                placeholder='Email'
                name='email'
                register={register}
                type='email'
              />
              <Input
                className='mt-2'
                errors={errors.password?.message}
                placeholder='Password'
                name='password'
                register={register}
                type='password'
                autoComplete='on'
              />
              <Input
                className='mt-2'
                errors={errors.confirm_password?.message}
                placeholder='Confirm Password'
                name='confirm_password'
                register={register}
                type='password'
                autoComplete='on'
              />
              <div className='mt-2'>
                <Button
                  className='flex w-full items-center justify-center bg-orange py-4 text-center text-sm uppercase text-white hover:bg-red-400'
                  type='submit'
                  isLoading={registerAccountMutation.isLoading}
                  disabled={registerAccountMutation.isLoading}
                >
                  Đăng ký
                </Button>
              </div>
              <div className='mt-5 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn đã có tài khoản?</span>
                <Link className='px-1 text-red-600' to={path.login}>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}