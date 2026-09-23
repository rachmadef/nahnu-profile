import { resolve } from 'path';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/storage': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        projects: resolve(__dirname, 'projects.html'),
        projectDetail: resolve(__dirname, 'project-detail.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        adminLogin: resolve(__dirname, 'admin/login.html'),
        adminDashboard: resolve(__dirname, 'admin/dashboard.html'),
        adminProjects: resolve(__dirname, 'admin/projects.html'),
        adminProjectCreate: resolve(__dirname, 'admin/project-create.html'),
        adminProjectEdit: resolve(__dirname, 'admin/project-edit.html'),
        adminCategories: resolve(__dirname, 'admin/categories.html'),
        adminTechnologies: resolve(__dirname, 'admin/technologies.html'),
        adminTeamMembers: resolve(__dirname, 'admin/team-members.html'),
        adminMessages: resolve(__dirname, 'admin/messages.html'),
        adminProfile: resolve(__dirname, 'admin/profile.html'),
      },
    },
  },
});
