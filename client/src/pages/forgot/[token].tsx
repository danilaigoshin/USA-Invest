import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import { InputModal } from '../../componenets/Input';
import { ButtonModal } from '../../componenets/Button';
import Navbar from '../../containers/Navbar';
import { Theme } from '../../store/interfaces';
import Footer from '../../containers/Footer';

const Form = styled.form`
  max-width: 500px;
  margin: 0 auto;
  border: 1px solid
    ${({ theme }: Theme) =>
      theme.colors.currentTheme === 'dark'
        ? theme.colors.secondary
        : theme.colors.background};

  border-radius: 15px;
  padding: 25px;
`;

const ForgetPasswordText = styled.p`
  font-size: 22px;
  padding-bottom: 15px;
`;

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  top: 33%;
  text-align: center;
`;

const Error = styled.p`
  padding-bottom: 10px;
  color: #b64e4e;
  font-size: 0.9rem;
`;

interface IFormData {
  password: string;
  passwordConfirm: string;
}

const ForgotPassword = () => {
  const { register, handleSubmit, errors, getValues } = useForm<IFormData>();
  const router = useRouter();
  const { token } = router.query;

  const onSubmit = async (formData: IFormData) => {
    const data = {
      token,
      password: formData.password,
      confirmPassword: formData.passwordConfirm,
    };

    try {
      const res = await axios.post('/api/accounts/reset-password', data);

      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />

      <Wrapper>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ForgetPasswordText style={{ fontSize: 22 }}>
            Восстановление пароля
          </ForgetPasswordText>

          <InputModal
            type="password"
            autoComplete="current-password"
            placeholder="Новый пароль"
            ref={register({ required: true, minLength: 6 })}
            name="password"
          />
          {errors.password && errors.password.type === 'required' && (
            <Error>Введите пароль</Error>
          )}
          {errors.password && errors.password.type === 'minLength' && (
            <Error>Пароль должен быть не менее 6 символов</Error>
          )}

          <InputModal
            type="password"
            placeholder="Повторите пароль"
            autoComplete="new-password"
            ref={register({
              required: true,
              minLength: 6,
              validate: (value) => value === getValues('password'),
            })}
            name="passwordConfirm"
          />
          {errors.passwordConfirm &&
            errors.passwordConfirm.type === 'required' && (
              <Error>Повторите пароль</Error>
            )}
          {errors.passwordConfirm &&
            errors.passwordConfirm.type !== 'required' && (
              <Error>Пароли должны совпадать</Error>
            )}

          <ButtonModal>Отправить</ButtonModal>
        </Form>
      </Wrapper>

      <Footer />
    </>
  );
};

export default ForgotPassword;
