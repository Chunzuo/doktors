import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
    component: () => import('../views/UserLayout.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/Home/Index.vue')
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('../views/About.vue')
      },
      {
        path: '/help',
        name: 'help',
        component: () => import('../views/Help.vue')
      },
      {
        path: '/find-doctors',
        name: 'find-doctors',
        component: () => import('../views/FindDoctors/Index.vue')
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue')
      },
      {
        path: '/doctors',
        component: () => import('../views/Doctors/Index.vue'),
        children: [
          {
            path: '/doctors-dashboard',
            name: 'doctors-dashboard',
            component: () =>
              import('../views/Doctors/components/DoctorsDashboard.vue')
          },
          {
            path: '/doctors-mypatients',
            name: 'doctors-mypatients',
            component: () =>
              import('../views/Doctors/components/DoctorsMyPatients.vue')
          },
          {
            path: '/doctors-scheduletime',
            name: 'doctors-scheduletime',
            component: () =>
              import('../views/Doctors/components/DoctorsSheduleTime.vue')
          },
          {
            path: '/doctors-profile',
            name: 'doctors-profile',
            component: () =>
              import('../views/Doctors/components/DoctorsProfile.vue')
          },
          {
            path: '/doctors-social',
            name: 'doctors-social',
            component: () =>
              import('../views/Doctors/components/DoctorsSocialMedia.vue')
          },
          {
            path: '/doctors-addpatient',
            name: 'doctors-addpatient',
            component: () =>
              import('../views/Doctors/components/DoctorsAddPatient.vue')
          },
          {
            path: '/doctors-setting',
            name: 'doctors-setting',
            component: () =>
              import('../views/Doctors/components/DoctorsSetting.vue')
          },
          {
            path: '/doctors-calendar',
            name: 'doctors-calendar',
            component: () =>
              import('../views/Doctors/components/DoctorsCalendar.vue')
          },
          {
            path: '/doctors-appointment',
            name: 'doctors-appointment',
            component: () =>
              import('../views/Doctors/components/DoctorsAppointment.vue')
          },
          {
            path: '/doctors-timeslot',
            name: 'doctors-timeslot',
            component: () =>
              import('../views/Doctors/components/DoctorsTimeSlot.vue')
          }
        ]
      },
      {
        path: '/doctors-patient-detail/:id',
        name: 'doctors-patient-detail',
        component: () => import('../views/Doctors/patientDetail/Index.vue')
      },
      {
        path: '/doctor-detail/:id',
        name: 'doctor-detail',
        component: () => import('../views/DoctorDetail.vue')
      },
      {
        path: '/user-management',
        name: 'user-management',
        component: () => import('../views/UserManagement.vue')
      },
      {
        path: '/ads-management',
        name: 'ads-management',
        component: () => import('../views/AdsManagement.vue')
      },
      {
        path: '/complete-profile',
        name: 'complete-profile',
        component: () => import('../views/CompleteProfile.vue')
      },
      {
        path: '/book-appointment/:id',
        name: 'book-appointment',
        component: () => import('../views/BookAppointment.vue')
      },
      {
        path: '/patient-dashboard',
        name: 'patient-dashboard',
        component: () => import('../views/PatientDashboard.vue')
      },
      {
        path: '/find-role',
        name: 'fine-role',
        component: () => import('../views/FindRole.vue')
      },
      {
        path: '/edit-userprofile/:id',
        name: 'edit-userprofile',
        component: () => import('../views/EditUserProfile.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
