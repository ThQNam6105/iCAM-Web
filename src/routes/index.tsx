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
import { ScrollToTop } from '../components/ScrollToTop/ScrollToTop';

import { AdminLogin } from '../pages/Admin/AdminLogin';
import { AdminDashboard } from '../pages/Admin/AdminDashboard';
import { AdminLayout } from '../components/Admin/AdminLayout';
import { ProtectedRoute } from '../components/Admin/ProtectedRoute';
import { AdminCareers } from '../pages/Admin/AdminCareers';
import { AdminFAQ } from '../pages/Admin/AdminFAQ';
import { AdminCategories } from '../pages/Admin/AdminCategories';
import { AdminMediaLibrary } from '../pages/Admin/AdminMediaLibrary';
import { AdminSettings } from '../pages/Admin/AdminSettings';
import { AdminCourses } from '../pages/Admin/AdminCourses';

export const AppRouter: React.FC = () => {
  const base = import.meta.env.BASE_URL;
  const basename = base.endsWith('/') && base.length > 1 ? base.slice(0, -1) : base;

  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="media" element={<AdminMediaLibrary />} />
          <Route path="faq" element={<AdminFAQ />} />
          <Route path="careers" element={<AdminCareers />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="curriculum" element={<Curriculum />} />
          <Route path="news" element={<News />} />
          <Route path="news/:slug" element={<News />} />
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
