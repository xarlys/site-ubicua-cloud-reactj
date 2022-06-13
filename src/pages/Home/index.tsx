import React, { useEffect, useState } from 'react';
import { Widget } from "../../components/Widget";
import Section, { items } from "../../components/Section"
import SideMenu from "../../components/SideMenu"
import MenuForm from "../../components/MenuForm"
import Carousel from '../../components/Carousel';

import carouselImages from '../../data/carousel';
import data from "../../data";
import Footer from '../../components/Footer';
import api from '../../services/api';
import SectionTest from '../../components/SectionTest';
import SectionTpc from '../../components/SectionTpc';
import SectionRight from '../../components/SectionRight';

//import { Container } from './styles';

interface IContentProps {
  id: string;
  title: string;
  description_one: string;
}

const Home: React.FC = () => {
  const showCarousel = <Carousel items={carouselImages} />;
  const imgs = (<><img src="/assets/cell.svg" className='top' /> <img src="/assets/cell02.svg" className='bottom'/></>)
  const img = <img src='/assets/container.svg' />

  const [sectionOne, setSectionOne] = useState<IContentProps[]>([])
  const [sectionTwo, setSectionTwo] = useState<IContentProps[]>([])
  const [sectionThree, setSectionThree] = useState<IContentProps[]>([])
  const [sectionFour, setSectionFour] = useState<IContentProps[]>([])
  
  useEffect(() => {
    async function fetchSection() {
      const responseSectionOne = await api.get('v1/sectionOne');
      const responseSectionTwo = await api.get('v1/sectionTwo');
      const responseSectionThree = await api.get('v1/sectionThree');
      const responseSectionFour = await api.get('v1/sectionFour');

      setSectionOne(responseSectionOne.data);
      setSectionTwo(responseSectionTwo.data);
      setSectionThree(responseSectionThree.data);
      setSectionFour(responseSectionFour.data);
    }

    fetchSection();
  }, [])

  return (
    <>
      {sectionOne.map(st => (
        <Section variant="white" sectionTitle={st.title} description={st.description_one} element={showCarousel} />
      ))}


      {sectionTwo.map(st => (
        <SectionTpc variant="blue" sectionTitle={st.title} description={st.description_one} />
      ))}


      {sectionThree.map(st => (
        <SectionRight variant="white" sectionTitle={st.title} description={st.description_one} element={img} />
      ))}
      
      {sectionFour.map(st => (
        <SectionTest variant="blue" sectionTitle={st.title} description={st.description_one}/>
      ))}

      <Section variant="white" sectionTitle={data[4].title} description={data[4].description} element={items}/>

      <SectionRight variant="black" sectionTitle={data[5].title} description={data[5].description} element={imgs} />
      <Footer />
      <SideMenu >
        <MenuForm />
      </SideMenu>
      <Widget />
    </>
  );
}

export default Home;