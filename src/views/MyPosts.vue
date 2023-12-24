<template>
  <div class="container">
    <div class="row">
      <h2 class="text-center">My posts</h2>
      <div class="mt-3 d-grid col-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <RouterLink to="/newpost" class="btn btn-primary">Add post</RouterLink>
      </div>
      <template v-if="isLoading">
        <div
          v-for="item in perPage"
          :key="item"
          class="my-3 col-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4"
        >
          <div class="card placeholder-glow" style="width: 100%">
            <!-- <img src="..." class="card-img-top" alt="..." /> -->
            <div class="card-body">
              <div class="d-flex justify-content-between mb-4">
                <h6 class="placeholder col-5"></h6>
                <h6 class="placeholder offset-2 col-5"></h6>
              </div>
              <h5 class="card-title placeholder col-10"></h5>
              <p class="card-text placeholder col-12"></p>
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <!-- <a href="#" class="btn btn-primary">Read more</a> -->
                <a
                  class="btn btn-primary disabled placeholder"
                  aria-disabled="true"
                >
                  <span style="opacity: 0">Read More</span>
                </a>
                <h6
                  class="placeholder"
                  style="width: 30px; height: 30px; border-radius: 50%"
                ></h6>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          v-for="post in posts"
          :key="post.id"
          class="my-3 col-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4"
        >
          <div class="card" style="width: 100%">
            <!-- <img src="..." class="card-img-top" alt="..." /> -->
            <div class="card-body">
              <div class="d-flex justify-content-between mb-4">
                <RouterLink :to="`/user/${post.owner.id}`">
                  <h6>
                    {{ post.owner.first_name }} {{ post.owner.last_name }}
                  </h6>
                </RouterLink>
                <small>
                  {{
                    new Date(post.created_at).toLocaleString("en-GB", {
                      timeZone:
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                    })
                  }}
                </small>
              </div>
              <h5 class="card-title">{{ post.title }}</h5>
              <p class="card-text">{{ post.body.slice(0, 100) }}...</p>
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <RouterLink :to="`/post/${post.id}`" class="btn btn-primary"
                  >Read more</RouterLink
                >
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    cursor: pointer;
                  "
                  @click="reactPost(post)"
                >
                  <svg
                    v-if="post.likes.map((u) => u.id).includes(+authStore.id)"
                    class="text-danger"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.388 2.25t-1.362 2.412q-.975 1.313-2.625 2.963T13.45 19.7L12 21Z"
                    />
                  </svg>
                  <svg
                    v-else
                    class="text-danger"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.388 2.25t-1.362 2.412q-.975 1.313-2.625 2.963T13.45 19.7L12 21Zm0-2.7q2.4-2.15 3.95-3.688t2.45-2.674q.9-1.138 1.25-2.026T20 8.15q0-1.5-1-2.5t-2.5-1q-1.175 0-2.175.662T12.95 7h-1.9q-.375-1.025-1.375-1.688T7.5 4.65q-1.5 0-2.5 1t-1 2.5q0 .875.35 1.763t1.25 2.025q.9 1.137 2.45 2.675T12 18.3Zm0-6.825Z"
                    />
                  </svg>
                  <p class="m-0">Liked: {{ post.likes.length }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
          <li class="page-item" @click="goBack">
            <a
              class="page-link"
              href="javascript:void(0)"
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo; </span>
            </a>
          </li>
          <li
            v-for="pageNumber in pageNumbers"
            :key="pageNumber"
            class="page-item"
            :class="{ disabled: pageNumber == '...' }"
            @click="goToPage(pageNumber)"
          >
            <a
              class="page-link"
              :class="{ 'bg-info': currentPage == pageNumber }"
              href="javascript:void(0)"
              >{{ pageNumber }}</a
            >
          </li>
          <li class="page-item" @click="goForward">
            <a class="page-link" href="javascript:void(0)" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapStores } from "pinia";
import { useAuthStore } from "@/stores/auth";
export default {
  data() {
    return {
      isLoading: true,
      posts: [],
      totalPosts: 0,
      perPage: 5,
      onSides: 2,
      currentPage: 1,
    };
  },
  computed: {
    ...mapStores(useAuthStore),
    pageNumbers() {
      let last_page = Math.ceil(this.totalPosts / this.perPage);
      let pages = [];
      for (let i = 1; i <= last_page; i++) {
        let offset = i == 1 || last_page ? this.onSides + 1 : this.onSides;
        if (
          i == 1 ||
          (this.currentPage - offset <= i && this.currentPage + offset >= i) ||
          i == this.currentPage ||
          i == last_page
        ) {
          pages.push(i);
        } else if (
          i == this.currentPage - (offset + 1) ||
          i == this.currentPage + (offset + 1)
        ) {
          pages.push("...");
        }
      }
      return pages;
    },
  },
  mounted() {
    this.getPosts();
  },
  methods: {
    async getPosts() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/api/v1/blog/me/posts/?page=${this.currentPage}&limit=${this.perPage}`
        );
        this.totalPosts = response.data.count;
        this.posts = response.data.results;
        this.isLoading = false;
      } catch (error) {
        if (error.response) {
          if (error.response.status == 401) {
            this.authStore.logout();
            this.$router.push({ name: "login" });
          }
        } else {
          toast.error("Something went wrong!", {
            autoClose: 2000,
            theme: "colored",
          });
        }
      }
    },
    async reactPost(post) {
      if (post.likes.map((u) => u.id).includes(+this.authStore.id)) {
        post.likes = post.likes.filter((u) => u.id != +this.authStore.id);
      } else {
        post.likes.push({
          id: +this.authStore.id,
          first_name: this.authStore.first_name,
          last_name: this.authStore.last_name,
        });
      }
      const response = await axios.post(`/api/v1/blog/posts/${post.id}/react/`);
      console.log(response.data);
    },
    goBack() {
      if (this.currentPage != 1) {
        this.currentPage--;
        this.getPosts();
      }
    },
    goForward() {
      if (this.currentPage != Math.ceil(this.totalPosts / this.perPage)) {
        this.currentPage++;
        this.getPosts();
      }
    },
    goToPage(pageNumber) {
      if (pageNumber != "...") {
        this.currentPage = pageNumber;
        this.getPosts();
      }
    },
  },
};
</script>