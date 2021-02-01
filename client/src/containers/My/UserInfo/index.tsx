import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button, ButtonModal } from '../../../componenets/Button';
import { Input } from '../../../componenets/Input';
import { loadUser } from '../../../store/actions/auth';
import { AppState } from '../../../store/interfaces';

const InfoWrapper = styled.div`
  padding-bottom: 25px;
`;

const UserInfoTextHeader = styled.p`
  font-size: 18px;
`;

const UserInfoText = styled.p`
  font-size: 18px;
  padding-top: 10px;
`;

const InputEdit = styled(Input)`
  margin-top: 20px;
`;

const Error = styled.p`
  color: #b64e4e;
  font-size: 0.9rem;
  padding-top: 18px;
  text-align: center;
`;

const Success = styled.p`
  color: #3d993d;
  padding-top: 20px;
`;

interface IFormData {
  name: string;
  password?: string;
  confirmPassword?: string;
}

const UserInfo = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, getValues } = useForm<IFormData>();
  const auth = useSelector((state: AppState) => state.auth);
  const [userInfoChanged, setUserInfoChanged] = useState(false);

  const [editClicked, setEditClicked] = useState(false);

  const onSubmit = async (formData: IFormData) => {
    const data: IFormData = {
      name: formData.name,
    };

    if (formData?.password?.length) {
      data.password = formData.password;
      data.confirmPassword = formData.confirmPassword;
    }

    try {
      const res = await axios.post('/api/accounts/update', data);
      dispatch(loadUser(res.data));
      setUserInfoChanged(true);
      setEditClicked(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InfoWrapper>
          <UserInfoTextHeader>Ваше имя:</UserInfoTextHeader>
          {!editClicked && <UserInfoText>{auth?.user.name}</UserInfoText>}
          {editClicked && (
            <>
              <InputEdit
                defaultValue={auth?.user.name}
                type="text"
                placeholder="Имя"
                autoComplete="username"
                ref={register({ required: true })}
                name="name"
              />

              {errors.name && <Error>Введите имя</Error>}
            </>
          )}
        </InfoWrapper>

        {!editClicked && auth?.user.email && (
          <InfoWrapper>
            <UserInfoTextHeader>Ваш Email:</UserInfoTextHeader>
            <UserInfoText>{auth?.user.email}</UserInfoText>
          </InfoWrapper>
        )}

        {auth?.user.loginMethod === 'Internal' && (
          <>
            {!editClicked && (
              <InfoWrapper>
                <UserInfoTextHeader>Ваш пароль:</UserInfoTextHeader>
                <UserInfoText>*********</UserInfoText>
              </InfoWrapper>
            )}

            {editClicked && (
              <>
                <InfoWrapper>
                  <UserInfoTextHeader>Новый пароль:</UserInfoTextHeader>
                  <InputEdit
                    type="password"
                    placeholder="Пароль"
                    autoComplete="new-password"
                    ref={register({
                      minLength: 6,
                    })}
                    name="password"
                  />
                  {errors.password && errors.password.type === 'minLength' && (
                    <Error>Пароль должен быть не менее 6 символов</Error>
                  )}
                </InfoWrapper>
                <InfoWrapper>
                  <UserInfoTextHeader>Повторите пароль:</UserInfoTextHeader>
                  <InputEdit
                    type="password"
                    placeholder="Повторите пароль"
                    autoComplete="new-password"
                    ref={register({
                      minLength: 6,
                      validate: (value) => value === getValues('password'),
                    })}
                    name="confirmPassword"
                  />
                  {errors.confirmPassword &&
                    errors.confirmPassword.type !== 'required' && (
                      <Error>Пароли должны совпадать</Error>
                    )}
                </InfoWrapper>
              </>
            )}

            {!editClicked && (
              <ButtonModal
                onClick={() => setEditClicked(true)}
                style={{ width: '70%', padding: 12 }}
              >
                Изменить
              </ButtonModal>
            )}

            {editClicked && (
              <>
                <ButtonModal style={{ width: '45%', padding: 12 }}>
                  Сохранить
                </ButtonModal>

                <Button
                  onClick={() => setEditClicked(false)}
                  style={{
                    width: '45%',
                    padding: 18,
                    fontSize: 13,
                    marginLeft: '10%',
                  }}
                >
                  Отменить
                </Button>
              </>
            )}
          </>
        )}
      </form>
      {userInfoChanged && <Success>Изменения успешно сохранены</Success>}
    </>
  );
};

export { UserInfo };
