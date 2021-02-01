import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ButtonLoader, ButtonModal } from '../../componenets/Button';
import { InputModal } from '../../componenets/Input';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { changeModal } from '../../store/actions/modal';
import { loadUser } from '../../store/actions/auth';

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

interface IErrorMessage {
  message: string;
}

interface IFormData {
  email: string;
}

const Email = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, errors } = useForm<IFormData>();
  const [isDone, setIsDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<IErrorMessage>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData: IFormData) => {
    const data = {
      email: formData.email,
    };

    try {
      setLoading(true);
      const res = await axios.post('/api/accounts/update', data);

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

  return (
    <Wrapper>
      <Header>Введите Email</Header>

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

          {!loading && <ButtonModal>Сохранить</ButtonModal>}
          {loading && <ButtonLoader />}

          {errorMessage?.message && (
            <Error style={{ paddingTop: 10 }}>{errorMessage.message}</Error>
          )}
        </form>
      </MarginWrapper>
    </Wrapper>
  );
};

export { Email };
