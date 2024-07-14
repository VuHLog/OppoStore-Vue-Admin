<script setup>
import { ref, getCurrentInstance, onMounted, watch } from "vue";
import { inject } from "vue";
import { useBaseStore } from "@/store/index.js";

const { proxy } = getCurrentInstance();
const store = useBaseStore();
const swal = inject("$swal");

const orders = ref([]);
const statusAvailable = ref([]);
const totalElements = ref(0);
const totalPages = ref(0);
const field = ref("name");
const sort = ref("ASC");
const pageSize = ref(0);
const pageNumber = ref(0);
const search = ref("");

onMounted(() => {
  proxy.$api.get("/api/orders").then((res) => {
    orders.value = res.content;
    totalElements.value = res.totalElements;
    totalPages.value = res.totalPages;
    pageSize.value = res.pageable.pageSize;
    pageNumber.value = res.pageable.pageNumber;
  });
  proxy.$api.get("/api/status").then((res) => {
    statusAvailable.value = res.result;
  });
});

const reloadData = () => {
  proxy.$api
    .get(
      "/api/orders?pageNumber=" +
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
      orders.value = res.content;
      totalElements.value = res.totalElements;
      totalPages.value = res.totalPages;
      pageSize.value = res.pageable.pageSize;
      pageNumber.value = res.pageable.pageNumber;
    });
};

watch(pageNumber, () => {
  reloadData();
});

watch(search, () => {
  pageNumber.value = 0;
  reloadData();
});

//cap nhat khi thay doi trang thai don hang
async function updateOrderStatus(orderStatus, orderId, customer, orderDetails) {
  await proxy.$api
    .put("/api/orders/" + orderId + "/status", {
      status: orderStatus,
    })
    .then(() => {
      const Toast = swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        didOpen: (toast) => {
          toast.onmouseenter = swal.stopTimer;
          toast.onmouseleave = swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Thay đổi trạng thái đơn hàng thành công!",
      });
    });

  await proxy.$api
    .post("/mail/send/" + customer.email, {
      subject: "Trạng thái đơn hàng",
      message:
        `<div>Đơn hàng ${orderId} hiện ${orderStatus.status}</div>` +
        orderDetails.reduce((html, orderDetail) => {
          return (
            html +
            `
              <li class="d-flex h-24 justify-space-between pt-3 pr-3">
                <div class="d-flex h-100">
                  <div class="h-100">
                    <img src="${
                      orderDetail.variant.image
                    }" alt="" class="h-100 object-contain object-center rounded-lg d-block" />
                  </div>
                  <div class="h-100 pl-3">
                    <div class="mb-1">
                      <span>${orderDetail.variant.mobilePhone.name}</span>
                    </div>
                    <div class="mb-1 text-grey-lighten-1 text-14">
                      <span>
                        Phân loại hàng: ${orderDetail.variant.color.name}/${
                        orderDetail.variant.rom.capacity
                      }GB
                      </span>
                    </div>
                    <div class="mb-1 text-14">
                      <span> Số lượng: ${orderDetail.quantity} </span>
                    </div>
                  </div>
                </div>
                <div class="h-100 d-flex align-center text-14">
                  <span class="text-price font-weight-medium">
                    ${new Intl.NumberFormat("en-DE").format(orderDetail.price)}₫
                  </span>
                </div>
              </li>`
          );
        }, ""),
    })
    .then(() => {
      console.log("successful mailing!");
    });
}
</script>

<template>
  <div id="" class="card">
    <div
      class="card-header d-flex justify-start align-center mb-4 font-weight-bold"
    >
      <span class="text-h5 user-none">Bảng đơn hàng</span>
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
                Ngày đặt hàng
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder opacity-7 ps-2 align-top"
              >
                Tên khách hàng
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder align-top"
              >
                Tổng tiền
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder align-top"
              >
                Trạng thái
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder align-top"
              >
                Ghi chú
              </th>
              <th
                class="text-start text-uppercase text-head-table text-xxs font-weight-bolder align-top"
              >
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(order, index) in orders" :key="order.id">
              <tr>
                <td class="align-middle text-start">
                  <div class="px-2 py-1">
                    {{ pageNumber * 5 + index + 1 }}
                  </div>
                </td>
                <td class="align-middle text-start text-sm">
                  <p class="text-xs text-body-table mb-0 text-start">
                    {{ order.createdTime }}
                  </p>
                </td>
                <td class="align-middle text-start text-sm cursor-pointer">
                  <p class="text-xs text-body-table mb-0 text-start">
                    {{ order.customer.name }}
                  </p>
                  <v-tooltip activator="parent" location="bottom">
                    <p>Tên: {{ order.customer.name }}</p>
                    <p>Địa chỉ: {{ order.customer.address }}</p>
                    <p>SĐT: {{ order.customer.phone }}</p>
                    <p>Email: {{ order.customer.email }}</p>
                  </v-tooltip>
                </td>
                <td class="align-middle text-start text-sm">
                  <p class="text-xs text-body-table mb-0 text-start">
                    {{
                      new Intl.NumberFormat("en-DE").format(order.totalPrice) +
                      "₫"
                    }}
                  </p>
                </td>
                <td class="align-middle text-start text-sm">
                  <select
                    @change="
                      updateOrderStatus(
                        order.status,
                        order.id,
                        order.customer,
                        order.orderDetails
                      )
                    "
                    v-model="order.status"
                    id="status-text-input text-xs text-body-table mb-0 text-start"
                    class="form-select"
                  >
                    <option disabled value="">{{ order.status.status }}</option>
                    <template
                      v-for="status in statusAvailable"
                      :key="status.id"
                    >
                      <option :value="status">
                        {{ status.status }}
                      </option>
                    </template>
                  </select>
                </td>
                <td class="align-middle text-start text-sm">
                  <p class="text-xs text-body-table mb-0 text-start">
                    {{ order.note }}
                  </p>
                </td>
                <td class="align-middle text-start">
                  <div class="d-flex">
                    <div class="cursor-pointer ml-4">
                      <router-link
                        class="text-info"
                        :to="'/orders/' + order.id + '/details'"
                      >
                        <font-awesome-icon :icon="['fas', 'info']" />
                      </router-link>
                      <v-tooltip activator="parent" location="bottom">
                        Chi tiết đơn hàng
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