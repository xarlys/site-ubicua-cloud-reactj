import React, { useEffect, useState } from "react";
import tpcItems from "../../data/tpcItems";
import api from "../../services/api";
import Header from "../Header";
import { Container, Content, Wrapper } from "./styles";

interface Props {
  variant: 'blue' | 'beige' | 'white' | 'black';
  sectionTitle: string;
  description: string;
}


const SectionTpc: React.FC<Props> = ({ variant, sectionTitle, description }) => {
  return (
    <Container className={variant}>
      <Header />
      <Content>
        <header>
          <h2>{sectionTitle}</h2>
          <p>{description}</p>
        </header>
        <Wrapper>
          {tpcItems.map(tpc => (
            <div>
              <img src={tpc.icon} />
              <h3>{tpc.title}</h3>
              <p>{tpc.description}</p>
            </div>
          ))}
        </Wrapper>
      </Content>
    </Container>
  )
}

export default SectionTpc;