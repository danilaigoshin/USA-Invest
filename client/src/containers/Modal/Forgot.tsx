import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { ButtonModal } from '../../componenets/Button';
import { InputModal } from '../../componenets/Input';

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

const Error = styled.p`
  padding-bottom: 10px;
  color: #b64e4e;
  font-size: 0.9rem;
`;

const Message = styled.p`
  padding-bottom: 10px;
  font-size: 0.9rem;
`;

interface IFormData {
  email: string;
}

const Forgot = () => {
  const { register, handleSubmit, errors } = useForm<IFormData>();
  const [message, setMessage] = useState<string>();

  const onSubmit = async (formData: IFormData) => {
    const data = {
      email: formData.email,
    };

    try {
      const res = await axios.post('api/accounts/forgot-password', data);
      setMessage(res.data.message);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Wrapper>
      <Header>Восстановление пароля</Header>

      <MarginWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputModal
            style={{ margin: '25px 0' }}
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

          {message && <Message>{message}</Message>}

          {errors.email && errors.email.type === 'required' && (
            <Error>Введите email</Error>
          )}
          {errors.email && errors.email.message && (
            <Error>Проверьте поле email</Error>
          )}

          <ButtonModal style={{ marginTop: '15px' }}>Восстановить</ButtonModal>
        </form>
      </MarginWrapper>
    </Wrapper>
  );
};

export { Forgot };
