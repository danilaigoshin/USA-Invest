import axios from 'axios';
import React, { MouseEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { ButtonLoader, ButtonModal } from '../../componenets/Button';
import { InputModal } from '../../componenets/Input';
import { SocialSignIn } from '../../componenets/SocialSignIn';
import { changeModal } from '../../store/actions/modal';
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

const MarginWrapper = styled.div`
  max-width: 370px;
  margin: 0 auto;
`;

const Login = styled.p`
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

const Successful = styled.p`
  padding: 10px;
  color: #3d993d;
  font-size: 0.9rem;
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

interface IFormData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const Register = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, getValues } = useForm<IFormData>();
  const [message, setMessage] = useState<string>();
  const [isEmailRegistered, setIsEmailRegistered] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordConfirmShown, setPasswordConfirmShown] = useState(false);

  const changeCurrentModal = (e: MouseEvent<HTMLElement>, value: string) => {
    e.preventDefault();
    dispatch(changeModal({ modalOpen: true, currentModal: value }));
  };

  const onSubmit = async (formData: IFormData) => {
    const data = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.password,
      acceptTerms: true,
    };

    try {
      setLoading(true);
      const res = await axios.post('/api/accounts/register', data);
      setMessage(res.data.message);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const emailIsUnique = async () => {
    const email = getValues('email');
    const { data } = await axios.get(
      `/api/accounts/isemailregistered?email=${email}`
    );
    setIsEmailRegistered(data);

    return data;
  };

  return (
    <Wrapper>
      <Header>Регистрация</Header>

      <MarginWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputModal
            type="text"
            placeholder="Имя"
            autoComplete="username"
            ref={register({ required: true })}
            name="name"
          />
          {errors.name && <Error>Введите имя</Error>}

          <InputModal
            placeholder="Email"
            autoComplete="email"
            ref={register({
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Неверный email',
              },
              validate: emailIsUnique,
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
              placeholder="Пароль"
              autoComplete="new-password"
              ref={register({
                required: true,
                minLength: 6,
              })}
              name="password"
            />
            {!passwordShown && (
              <Icon
                onClick={() => setPasswordShown(passwordShown ? false : true)}
                src="/Icons/eye.svg"
                alt="Показать пароль"
              />
            )}
            {passwordShown && (
              <Icon
                onClick={() => setPasswordShown(passwordShown ? false : true)}
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

          <PassWrapper>
            <InputModal
              type={passwordConfirmShown ? 'text' : 'password'}
              placeholder="Повторите пароль"
              autoComplete="new-password"
              ref={register({
                required: true,
                minLength: 6,
                validate: (value) => value === getValues('password'),
              })}
              name="passwordConfirm"
            />

            {!passwordConfirmShown && (
              <Icon
                onClick={() =>
                  setPasswordConfirmShown(passwordConfirmShown ? false : true)
                }
                src="/Icons/eye.svg"
                alt="Показать пароль"
              />
            )}
            {passwordConfirmShown && (
              <Icon
                onClick={() =>
                  setPasswordConfirmShown(passwordConfirmShown ? false : true)
                }
                src="/Icons/eye-slash.svg"
                alt="Скрыть пароль"
              />
            )}
          </PassWrapper>
          {errors.passwordConfirm &&
            errors.passwordConfirm.type === 'required' && (
              <Error>Повторите пароль</Error>
            )}
          {errors.passwordConfirm &&
            errors.passwordConfirm.type !== 'required' && (
              <Error>Пароли должны совпадать</Error>
            )}

          {!loading && (
            <ButtonModal style={{ marginTop: '15px' }}>
              Зарегистрироваться
            </ButtonModal>
          )}
          {loading && <ButtonLoader />}
        </form>

        {message && <Successful>{message}</Successful>}

        {isEmailRegistered === false && (
          <Error style={{ paddingTop: 10 }}>Email уже зарегестрирован</Error>
        )}

        <Login onClick={(e) => changeCurrentModal(e, 'login')}>
          Войти в аккаунт
        </Login>

        <SocialSignIn />
      </MarginWrapper>
    </Wrapper>
  );
};

export { Register };
