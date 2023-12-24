<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h2>Sign Up</h2>
        <form @submit.prevent="signup">
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
            <label for="firstName" class="form-label"> First name </label>
            <input
              type="text"
              v-model="firstName"
              class="form-control"
              id="firstName"
            />
          </div>
          <div class="mb-3">
            <label for="lastName" class="form-label"> Last name </label>
            <input
              type="text"
              v-model="lastName"
              class="form-control"
              id="lastName"
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
          <button type="submit" class="btn btn-primary">Sign Up</button>
        </form>
        <p>
          Already have an account? <RouterLink to="/login">Login</RouterLink>
        </p>
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
      firstName: "",
      lastName: "",
      password: "",
    };
  },
  computed: {
    ...mapStores(useAuthStore),
  },
  methods: {
    async signup() {
      try {
        const response = await axios.post("/api/v1/auth/signup/", {
          email: this.email,
          first_name: this.firstName,
          last_name: this.lastName,
          password: this.password,
        });
        setTimeout(() => {
          this.$router.replace("/login");
        }, 1500);
        toast.success('Account successfully created. Please, log in!', {
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
  },
};
</script>

<style>
</style>