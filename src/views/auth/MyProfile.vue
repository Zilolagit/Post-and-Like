<template>
  <div class="container">
    <div class="row">
      <div
        v-if="me"
        class="mt-3 d-grid col-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4"
      >
      <RouterLink to="/me/posts">My posts</RouterLink>
      <RouterLink to="/me/liked-posts">Liked posts</RouterLink>
        <h2>Settings</h2>
        <form @submit.prevent="updateProfile">
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">
              Email address
            </label>
            <input
              type="email"
              v-model="me.email"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
          </div>
          <div class="mb-3">
            <label for="firstName" class="form-label"> First name </label>
            <input
              type="text"
              v-model="me.first_name"
              class="form-control"
              id="firstName"
            />
          </div>
          <div class="mb-3">
            <label for="lastName" class="form-label"> Last name </label>
            <input
              type="text"
              v-model="me.last_name"
              class="form-control"
              id="lastName"
            />
          </div>
          <!-- <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">
              Password
            </label>
            <input
              type="password"
              v-model="password"
              class="form-control"
              id="exampleInputPassword1"
            />
          </div> -->
          <button type="submit" class="btn btn-primary">Save</button>
        </form>
        <hr />
        <h2>Change password</h2>
        <form @submit.prevent="updatePassword">
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">
              Old password
            </label>
            <input
              type="password"
              v-model="oldPassword"
              class="form-control"
              id="exampleInputPassword1"
            />
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword2" class="form-label">
              New password
            </label>
            <input
              type="password"
              v-model="newPassword1"
              class="form-control"
              id="exampleInputPassword2"
            />
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword3" class="form-label">
              New password confirm
            </label>
            <input
              type="password"
              v-model="newPassword2"
              class="form-control"
              id="exampleInputPassword3"
            />
          </div>
          <button type="submit" class="btn btn-primary">Change</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapStores } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  data() {
    return {
      me: null,
      oldPassword: "",
      newPassword1: "",
      newPassword2: "",
    };
  },
  computed: {
    ...mapStores(useAuthStore),
  },
  async mounted() {
    const response = await axios.get("/api/v1/auth/profile/");
    this.me = response.data;
  },
  methods: {
    async updateProfile() {
      try {
        const response = await axios.put("/api/v1/auth/profile/", {
          email: this.me.email,
          first_name: this.me.first_name,
          last_name: this.me.last_name,
        });
        this.me = response.data;
        toast.success("Success", {
          autoClose: 2000,
          theme: "colored",
        });
      } catch (error) {
        if (error.response) {
          if (error.response.status == 400) {
            for (let key in error.response.data) {
              toast.error(`${key}: ${error.response.data[key]}`, {
                autoClose: 2000,
                theme: "colored",
              });
            }
          }
        } else {
          toast.error("Something went wrong! Try again later!", {
            autoClose: 2000,
            theme: "colored",
          });
        }
      }
    },
    async updatePassword() {
      if (this.newPassword1 !== this.newPassword2) {
        toast.error("Doesn't match!", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      try {
        const response = await axios.patch(
          "/api/v1/auth/profile/set_password/",
          {
            current_password: this.oldPassword,
            new_password: this.newPassword1,
          }
        );
        toast.success("Success", {
          autoClose: 2000,
          theme: "colored",
        });
        setTimeout(() => {
            this.authStore.logout();
            this.$router.push('/login');
        }, 1500)
      } catch (error) {
        if (error.response) {
          if (error.response.status == 400) {
            for (let key in error.response.data) {
              toast.error(`${key}: ${error.response.data[key]}`, {
                autoClose: 2000,
                theme: "colored",
              });
            }
          }
        } else {
          toast.error("Something went wrong! Try again later!", {
            autoClose: 2000,
            theme: "colored",
          });
        }
      }
    },
  },
};
</script>