import React, { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form } from '../../components/MenuForm/styles';
import Button from '../../components/Button'

import Input from '../../components/Input';

import { Grid, Gif, Carousel } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from "@giphy/js-types";
import { useAsync } from "react-async-hook";

import { AnimationContainer, Container, Content, SignInGiphy, WrapperGif } from './styles';
import api from '../../services/api';
// interface SignUpProps {
//   name: string;
//   email: string;
//   password: string;
//   active?: boolean;
//   type_user_id: string;
// }

const SignUp: React.FC = () => {
  const giphyFetch = new GiphyFetch("1V6GHHb75bB2t02EVqaO8Euc0hIQCGGb")
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [active, setActive] = useState(true)
  const [type_user_id, setType_user_id] = useState('d6e46846-7688-4a81-b0f4-8c57037d2029')

  //const fetchGifs = (offset: number) => giphyFetch.trending({ offset, limit: 10 })
  let navigate = useNavigate();

  async function submitSignUp(event: FormEvent) {
    event.preventDefault();

    await api.post('/v1/users/create', {
      name,
      email,
      password,
      active,
      type_user_id
    });
  }

  function GifDemo() {
    const [gif, setGif] = useState<IGif | null>(null);
    useAsync(async () => {
      const { data } = await giphyFetch.gif("BpJWIIYcGd2Cc");
      setGif(data);
    }, []);
    return gif && <Gif gif={gif} width={685} height={649}  noLink={true} className="gif" />;
  }

  return (
    <Container>
      <WrapperGif>
        <GifDemo />
      </WrapperGif>
      <Content>
        <AnimationContainer>
          <Form onSubmit={submitSignUp}>
            <span className='title'>Registre-se</span>
            <span className='subtitle'>preencha o formulário abaixo</span>

            <Input type="text" placeholder='Nome' change={event => setName(event.target.value)}/>
            <Input type="email" placeholder='E-mail' change={event => setEmail(event.target.value)} />
            <Input type="password" placeholder='Senha' change={event => setPassword(event.target.value)}/>

            <Button type='submit' text='Cadastrar' submit={() => navigate("/login")}/>

            <span className='terms'>
              Esta página está sujeita à Política de privacidade e aos Termos de serviço.
            </span>
          </Form>
          <Link to="/">
            Página inícial
          </Link>
        </AnimationContainer>
      
      </Content>
      {/* <CarouselDemo /> */}


      {/* <SignInGiphy /> */}
      {/* <Grid width={200} columns={3} fetchGifs={fetchGifs} /> */}
    </Container>
  );
}

export default SignUp;