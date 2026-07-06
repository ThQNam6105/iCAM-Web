import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { Home } from '../pages/Home/Home';
import { About } from '../pages/About/About';
import { Curriculum } from '../pages/Curriculum/Curriculum';
import { News } from '../pages/News/News';
import { FAQ } from '../pages/FAQ/FAQ';
import { Careers } from '../pages/Careers/Careers';
import { Contact } from '../pages/Contact/Contact';
import { NotFound } from '../pages/NotFound/NotFound';

export const AppRouter: React.FC = () => {
  const basename = import.meta.env.DEV ? '/' : '/iCAM-Web';

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="curriculum" element={<Curriculum />} />
          <Route path="news" element={<News />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="careers" element={<Careers />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
