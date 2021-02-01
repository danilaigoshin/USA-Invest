import React, { MouseEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ButtonLoader, ButtonModal } from '../../componenets/Button';
import { InputModal } from '../../componenets/Input';
import { useForm } from 'react-hook-form';
import { SocialSignIn } from '../../componenets/SocialSignIn';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { changeModal } from '../../store/actions/modal';
import { loadUser } from '../../store/actions/auth';
import Link from 'next/link';
import { Theme } from '../../store/interfaces';

const Wrapper = styled.div`
  margin: 0 auto;
  padding: 10px 0;

  text-align: center;
`;

const Header = styled.h2`
  font-size: 1.9rem;
  letter-spacing: 2px;

  padding-bottom: 15px;
`;

const ForgotPassword = styled.p`
  margin-bottom: 15px;
  text-align: right;
  font-size: 0.8rem;
  cursor: pointer;
`;

const MarginWrapper = styled.div`
  max-width: 370px;
  margin: 0 auto;
`;

const Register = styled.p`
  text-align: center;
  font-size: 0.8rem;
  padding-top: 15px;
  cursor: pointer;
`;

const Error = styled.p`
  padding-bottom: 10px;
  color: #b64e4e;
  font-size: 0.9rem;
`;

const UserInfo = styled.p`
  margin-bottom: 15px;
  font-size: 14px;
`;

const PassWrapper = styled.div`
  position: relative;
  display: flex;
`;

const Icon = styled.img`
  position: absolute;
  right: 20px;
  filter: ${({ theme }: Theme) => theme.colors.logo};
  height: 17px;
  top: 40%;
`;

interface IErrorMessage {
  message: string;
}

interface IFormData {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, errors } = useForm<IFormData>();
  const [isDone, setIsDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<IErrorMessage>();
  const [loading, setLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);

  const changeCurrentModal = (e: MouseEvent<HTMLElement>, value: string) => {
    e.preventDefault();
    dispatch(changeModal({ modalOpen: true, currentModal: value }));
  };

  const onSubmit = async (formData: IFormData) => {
    const data = {
      email: formData.email,
      password: formData.password,
    };

    try {
      setLoading(true);
      const res = await axios.post('/api/accounts/authenticate', data);

      dispatch(loadUser(res.data));
      setIsDone(true);
    } catch (err) {
      setErrorMessage(err.response.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isDone) {
      dispatch(changeModal({ modalOpen: false, currentModal: '' }));
    }
  }, [isDone]);

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  return (
    <Wrapper>
      <Header>Вход</Header>

      <MarginWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputModal
            type="email"
            placeholder="Email"
            autoComplete="email"
            ref={register({
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Неверный email',
              },
            })}
            name="email"
          />
          {errors.email && errors.email.type === 'required' && (
            <Error>Введите email</Error>
          )}
          {errors.email && errors.email.message && (
            <Error>Проверьте поле email</Error>
          )}

          <PassWrapper>
            <InputModal
              type={passwordShown ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Пароль"
              ref={register({ required: true, minLength: 6 })}
              name="password"
            />

            {!passwordShown && (
              <Icon
                onClick={togglePasswordVisiblity}
                src="/Icons/eye.svg"
                alt="Показать пароль"
              />
            )}
            {passwordShown && (
              <Icon
                onClick={togglePasswordVisiblity}
                src="/Icons/eye-slash.svg"
                alt="Скрыть пароль"
              />
            )}
          </PassWrapper>
          {errors.password && errors.password.type === 'required' && (
            <Error>Введите пароль</Error>
          )}
          {errors.password && errors.password.type === 'minLength' && (
            <Error>Пароль должен быть не менее 6 символов</Error>
          )}

          <ForgotPassword onClick={(e) => changeCurrentModal(e, 'forgot')}>
            Забыли пароль?
          </ForgotPassword>

          <UserInfo>
            Входя в систему, вы соглашаетесь{' '}
            <Link href="/terms">
              <a style={{ color: '#169bf4' }}>с пользовательским соглашением</a>
            </Link>{' '}
            и{' '}
            <Link href="/privacy">
              <a style={{ color: '#169bf4' }}>политикой конфиденциальности</a>
            </Link>
          </UserInfo>

          {!loading && <ButtonModal>Войти</ButtonModal>}
          {loading && <ButtonLoader />}

          {errorMessage?.message && (
            <Error style={{ paddingTop: 10 }}>{errorMessage.message}</Error>
          )}

          <Register onClick={(e) => changeCurrentModal(e, 'register')}>
            Создать аккаунт
          </Register>
        </form>

        <SocialSignIn />
      </MarginWrapper>
    </Wrapper>
  );
};

export { Login };
