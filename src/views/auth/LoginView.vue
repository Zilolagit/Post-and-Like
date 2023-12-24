<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h2>Login</h2>
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">
              Email address
            </label>
            <input
              type="email"
              v-model="email"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">
              Password
            </label>
            <input
              type="password"
              v-model="password"
              class="form-control"
              id="exampleInputPassword1"
            />
          </div>
          <!-- <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1" />
        <label class="form-check-label" for="exampleCheck1">Check me out</label>
      </div> -->
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <p>No account yet? <RouterLink to="/signup">Sign up</RouterLink></p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { mapStores } from "pinia";
import { useAuthStore } from "@/stores/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  computed: {
    ...mapStores(useAuthStore),
  },
  methods: {
    async login() {
      this.authStore.logout();
      try {
        const response = await axios.post("/api/v1/auth/login/", {
          email: this.email,
          password: this.password,
        });
        // toast.success("Login successful!", {
        //   autoClose: 2000,
        //   theme: "colored",
        // });
        this.authStore.id = response.data.id;
        this.authStore.email = response.data.email;
        this.authStore.first_name = response.data.first_name;
        this.authStore.last_name = response.data.last_name;
        this.authStore.tokens = response.data.tokens;
        localStorage.setItem("sm-id", response.data.id);
        localStorage.setItem("sm-email", response.data.email);
        localStorage.setItem("sm-first_name", response.data.first_name);
        localStorage.setItem("sm-last_name", response.data.last_name);
        localStorage.setItem("sm-at", response.data.tokens.access);
        localStorage.setItem("sm-rt", response.data.tokens.refresh);

        localStorage.setItem(
          "shouldRefreshAt",
          new Date().getTime() + 55 * 1000
        );

        axios.defaults.headers[
          "Authorization"
        ] = `Bearer ${this.authStore.tokens.access}`;
        this.$router.replace("/");
      } catch (error) {
        if (error.response) {
          if (error.response.status == 401) {
            toast.error("Invalid credentials!", {
              autoClose: 2000,
              theme: "colored",
            });
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

<style>
</style>