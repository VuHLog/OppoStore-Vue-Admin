<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const { proxy } = getCurrentInstance();

const router = useRouter();

const route = useRoute();
const orderId = route.params.orderId;

const orderDetails = ref([]);
const totalPrice = ref();

onMounted(async () => {
  await proxy.$api
    .get("/api/orders/" + orderId + "/details")
    .then((res) => {
      orderDetails.value = res.result;
    })
    .catch((error) => console.log(error));

  totalPrice.value = orderDetails.value.reduce((prev, curr) => {
    return prev + curr.price * curr.quantity;
  }, 0);
});

function returnTable() {
  router.push("/orders");
}
</script>

<template>
  <div class="card px-0 pt-0 pb-2">
    <div class="card-body p-5">
      <ul class="p-0 m-0 w-100 border-b-sm border-solid border-b-custom">
        <template v-for="orderDetail in orderDetails" :key="orderDetail.id">
          <li class="d-flex h-24 d-flex justify-space-between pt-3 pr-3">
            <div class="d-flex h-100">
              <div class="h-100">
                <img
                  :src="orderDetail.variant.image"
                  alt=""
                  class="h-100 object-contain object-center rounded-lg d-block"
                />
              </div>
              <div class="h-100 pl-3">
                <div class="mb-1">
                  <span>
                    {{ orderDetail.variant.mobilePhone.name }}
                  </span>
                </div>
                <div class="mb-1 text-grey-lighten-1 text-14">
                  <span>
                    Phân loại hàng:
                    {{
                      orderDetail.variant.color.name +
                      "/" +
                      orderDetail.variant.rom.capacity +
                      "GB"
                    }}
                  </span>
                </div>
                <div class="mb-1 text-14">
                  <span> Số lượng: {{ orderDetail.quantity }} </span>
                </div>
              </div>
            </div>
            <div class="h-100 d-flex align-center text-14">
              <span class="text-price font-weight-medium">{{
                new Intl.NumberFormat("en-DE").format(orderDetail.price) + "₫"
              }}</span>
            </div>
          </li>
        </template>
      </ul>
      <div class="pb-3 pt-6 px-6 text-end">
        <div>
          <span class="text-14 mr-3">Thành tiền:</span>
          <span class="text-xl text-price font-weight-medium">{{
            new Intl.NumberFormat("en-DE").format(totalPrice) + "₫"
          }}</span>
        </div>
      </div>
      <div class="d-flex justify-start align-center">
        <button
          type="button"
          class="btn btn-submit bg-gradient-submit py-3 mr-3"
          @click="returnTable()"
        >
          Quay lại
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>