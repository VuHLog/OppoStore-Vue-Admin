<script setup>
import { ref, getCurrentInstance, onMounted, watch } from "vue";
import { useBaseStore } from "@/store/index.js";
import { inject } from "vue";

const { proxy } = getCurrentInstance();
const swal = inject("$swal");

const mobilePhones = ref([]);
const totalElements = ref(0);
const totalPages = ref(0);
const field = ref("name");
const sort = ref("ASC");
const pageSize = ref(0);
const pageNumber = ref(0);
const search = ref("");

function truncateData(data) {
  const maxLength = 10;
  return data.length > maxLength ? data.substring(0, maxLength) + "..." : data;
}

onMounted(() => {
  proxy.$api.get("/api/mobilePhones").then((res) => {
    mobilePhones.value = res.content;
    totalElements.value = res.totalElements;
    totalPages.value = res.totalPages;
    pageSize.value = res.pageable.pageSize;
    pageNumber.value = res.pageable.pageNumber;
  });
});

const reloadData = () => {
  proxy.$api
    .get(
      "/api/mobilePhones?pageNumber=" +
        pageNumber.value +
        "&pageSize=" +
        pageSize.value +
        "&sort=" +
        sort.value +
        "&field=" +
        field.value +
        "&search=" +
        search.value
    )
    .then((res) => {
      mobilePhones.value = res.content;
      totalElements.value = res.totalElements;
      totalPages.value = res.totalPages;
      pageSize.value = res.pageable.pageSize;
      pageNumber.value = res.pageable.pageNumber;
    });
};

async function deleteMobilePhone(id) {
  swal
    .fire({
      title: "Bạn có chắc chắn muốn xoá không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ bỏ",
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        await proxy.$api.delete("/api/mobilePhones/" + id, {}).then(() => {
          console.log("Xoá thành công!");
        });
        reloadData();
        swal.fire({
          title: "Đã xoá!",
          icon: "success",
        });
      }
    });
}

watch(pageNumber, () => {
  reloadData();
});

watch(search, () => {
  pageNumber.value = 0;
  reloadData();
});
</script>

<template>
  <div id="" class="card">
    <div
      class="card-header d-flex justify-space-between align-center mb-4 font-weight-bold"
    >
      <span class="text-h5 user-none">Bảng Điện Thoại</span>
      <div class="btn btn-success">
        <font-awesome-icon :icon="['fas', 'plus']" />
        <router-link to="/createMobilePhone">
          <button class="text-white" type="button">Thêm mới</button>
        </router-link>
      </div>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="pe-md-3 mb-8 d-flex align-items-center justify-end">
        <div class="input-group w-25">
          <label for="input-search" class="input-group-text text-body">
            <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
          </label>
          <input
            v-model.trim="search"
            id="input-search"
            type="text"
            class="form-control"
            placeholder="Nhập để tìm kiếm ..."
          />
        </div>
      </div>
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead class="table-dark">
            <tr>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder opacity-7 align-top"
              >
                STT
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder opacity-7 align-top"
              >
                Tên
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder opacity-7 ps-2 align-top"
              >
                Camera trước
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder align-top"
              >
                Camera sau
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder align-top"
              >
                CPU
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder align-top"
              >
                Màn hình
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder align-top"
              >
                Độ phân giải
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder align-top"
              >
                RAM
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder align-top"
              >
                Màu sắc/ROM
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder align-top"
              >
                Thẻ nhớ
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder align-top"
              >
                Sim
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder align-top"
              >
                Hệ điều hành
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder align-top"
              >
                Kích thước
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder align-top"
              >
                Trọng lượng
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder align-top"
              >
                Pin
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder align-top"
              >
                Thương hiệu
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder align-top"
              >
                Dòng sản phẩm
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder align-top"
              >
                Trạng thái
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder align-top"
              >
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(mobilePhone, index) in mobilePhones" :key="mobilePhone.id">
              <tr>
                <td class="align-middle text-start">
                  <div class="px-2 py-1">
                    {{ pageNumber * 5 + index + 1 }}
                  </div>
                </td>
                <td class="align-middle text-start text-sm">
                  <p class="text-xs text-body-table mb-0 text-start">
                    {{ mobilePhone.name }}
                  </p>
                </td>
                <td class="align-middle text-start text-sm">
                  <p class="text-xs text-body-table mb-0 text-start">
                    {{ mobilePhone.frontCamera }}
                  </p>
                </td>
                <td class="align-middle text-start text-sm">
                  <p class="text-xs text-body-table mb-0 text-start">
                    {{ mobilePhone.rearCamera }}
                  </p>
                </td>
                <td class="align-middle text-start text-sm">
                  <p class="text-xs text-body-table mb-0 text-start">
                    {{ mobilePhone.cpu }}
                  </p>
                </td>
                <td class="align-middle text-start text-sm">
                  <p class="text-xs text-body-table mb-0 text-start">
                    {{ mobilePhone.screen }}
                  </p>
                </td>
                <td class="align-middle text-start text-sm">
                  <p class="text-xs text-body-table mb-0 text-start">
                    {{ mobilePhone.resolution }}
                  </p>
                </td>
                <td class="align-middle text-start text-sm">
                  <p class="text-xs text-body-table mb-0 text-start">
                    {{ mobilePhone.ram }}
                  </p>
                </td>
                <td class="align-middle text-start text-sm">
                  <p class="text-xs text-body-table mb-0 text-start">
                    <template v-for="variant in mobilePhone.variants" :key="variant.id">
                      <span>
                        {{ variant.color.name + " / " +variant.rom.capacity + " GB"}}
                      </span>
                    </template>
                  </p>
                </td>
                <td class="align-middle text-start text-sm">
                  <p class="text-xs text-body-table mb-0 text-start">
                    {{ mobilePhone.memoryStick }}
                  </p>
                </td>
                <td class="align-middle text-start text-sm">
                  <p class="text-xs text-body-table mb-0 text-start">
                    {{ mobilePhone.sim }}
                  </p>
                </td>
                <td class="align-middle text-start text-sm">
                  <p class="text-xs text-body-table mb-0 text-start">
                    {{ mobilePhone.operatingSystem }}
                  </p>
                </td>
                <td class="align-middle text-start text-sm">
                  <p class="text-xs text-body-table mb-0 text-start">
                    {{ mobilePhone.size }}
                  </p>
                </td>
                <td class="align-middle text-start text-sm">
                  <p class="text-xs text-body-table mb-0 text-start">
                    {{ mobilePhone.weight }}
                  </p>
                </td>
                <td class="align-middle text-start text-sm">
                  <p class="text-xs text-body-table mb-0 text-start">
                    {{ mobilePhone.battery }}
                  </p>
                </td>
                <td class="align-middle text-start text-sm">
                  <p class="text-xs text-body-table mb-0 text-start">
                    {{ mobilePhone.brand.name }}
                  </p>
                </td>
                <td class="align-middle text-start text-sm">
                  <p class="text-xs text-body-table mb-0 text-start">
                    {{ mobilePhone.category.name }}
                  </p>
                </td>
                <td class="align-middle text-start text-sm">
                  <p class="text-xs text-body-table mb-0 text-start">
                    {{ mobilePhone.status }}
                  </p>
                </td>
                <td class="align-middle text-start">
                  <div class="d-flex">
                    <div class="icon-edit">
                      <router-link :to="'/editMobilePhone/' + mobilePhone.id">
                        <font-awesome-icon :icon="['fas', 'pen-to-square']" />
                      </router-link>
                      <v-tooltip activator="parent" location="bottom">
                        Chỉnh sửa
                      </v-tooltip>
                    </div>
                    <div class="icon-delete cursor-pointer ml-4">
                      <div class="text-red" @click="deleteMobilePhone(mobilePhone.id)">
                        <font-awesome-icon :icon="['fas', 'trash-can']" />
                      </div>
                      <v-tooltip activator="parent" location="bottom">
                        Xoá
                      </v-tooltip>
                    </div>
                    <div class=" cursor-pointer ml-4">
                      <router-link
                        class="text-info"
                        :to="'/infoMobilePhone/' + mobilePhone.id"
                      >
                        <font-awesome-icon :icon="['fas', 'info']" />
                      </router-link>
                      <v-tooltip activator="parent" location="bottom">
                        Thông tin
                      </v-tooltip>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>

        <nav class="mt-4" aria-label="Page navigation example">
          <ul class="pagination justify-end">
            <li
              class="page-item p-3 text-info cursor-pointer"
              v-show="pageNumber + 1 > 1"
              @click="pageNumber--"
            >
              <font-awesome-icon :icon="['fas', 'chevron-left']" />
            </li>
            <li class="page-item p-3 text-info">
              {{ pageNumber + 1 }}
            </li>
            <li
              class="page-item p-3 text-info cursor-pointer"
              v-show="pageNumber + 1 < totalPages"
              @click="pageNumber++"
            >
              <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.avatar-user {
  height: 40px;
}
</style>