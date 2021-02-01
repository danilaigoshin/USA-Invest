import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button } from '../../../componenets/Button';
import { Input } from '../../../componenets/Input';
import { loadUser } from '../../../store/actions/auth';
import { AppState } from '../../../store/interfaces';
import { status } from '../../../utils/status';

const InfoWrapper = styled.div`
  padding-bottom: 25px;
`;

const MarginWrapper = styled.div`
  margin: 10px 0 25px 0;
`;

const UserInfoTextHeader = styled.p`
  font-size: 18px;
`;

const UserInfoText = styled.p`
  font-size: 18px;
  padding-top: 10px;
`;

const Success = styled.p`
  color: #3d993d;
  padding-top: 20px;
`;

const Error = styled.p`
  color: #b64e4e;
  padding-top: 20px;
`;

interface IFormData {
  promo: string;
}

const Promo = () => {
  const { register, handleSubmit } = useForm<IFormData>();
  const [messageSuccess, setMessageSuccess] = useState('');
  const [messageError, setMessageError] = useState('');
  const user = useSelector((state: AppState) => state.auth?.user);
  const dispatch = useDispatch();

  const onSubmit = async (formData: IFormData) => {
    setMessageSuccess('');
    setMessageError('');

    try {
      const res = await axios.post(`/api/my/UsePromocode/${formData.promo}`);

      if (user) {
        const updateUser = user;
        updateUser.role = 'UserWithSub';
        dispatch(loadUser(updateUser));
      }

      setMessageSuccess(res.data.message);
    } catch (err) {
      setMessageError(err.response.data.message);
    }
  };

  return (
    <>
      <InfoWrapper>
        <UserInfoTextHeader>Тип аккаунта:</UserInfoTextHeader>
        <UserInfoText>{status(user!.role)}</UserInfoText>
      </InfoWrapper>
      {user?.role === 'User' && (
        <InfoWrapper>
          <UserInfoTextHeader style={{ paddingBottom: 15 }}>
            PRO доступ по промокоду
          </UserInfoTextHeader>
          <MarginWrapper>
            <Input
              type="string"
              placeholder="Введите промокод"
              autoComplete="promo"
              name="promo"
              style={{ maxWidth: 350 }}
              ref={register({ required: true })}
            />
          </MarginWrapper>

          <Button
            onClick={handleSubmit(onSubmit)}
            style={{ maxWidth: 150, padding: 18, fontSize: 13 }}
          >
            Активировать
          </Button>
          {messageError && <Error>{messageError}</Error>}
          {messageSuccess && <Success>{messageSuccess}</Success>}
        </InfoWrapper>
      )}
    </>
  );
};

export { Promo };
