<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const { proxy } = getCurrentInstance();

const router = useRouter();

const route = useRoute();
const importReceiptId = route.params.importReceiptId;

const importReceipt = ref({});
const importReceiptDetails = ref([]);

onMounted(async() => {
  await proxy.$api
    .get("/api/import-receipts/"+ importReceiptId +"/import-receipt-details")
    .then((res) => {
      importReceiptDetails.value = res.result;
    })
    .catch((error) => console.log(error));

    await proxy.$api
    .get("/api/import-receipts/" + importReceiptId)
    .then((res) => {
      importReceipt.value = res.result;
      importReceipt.value.importReceiptDetails = importReceiptDetails.value.map((value) =>({
        id: value.id,
        quantity: value.quantity,
        price: value.price,
        variant: {
          id: value.imeiSet[0].variant.id,
          name: `${value.imeiSet[0].variant.mobilePhone.name} ${value.imeiSet[0].variant.mobilePhone.ram}GB/${value.imeiSet[0].variant.rom.capacity}GB màu ${value.imeiSet[0].variant.color.name}`,
        }
      }))
    })
    .catch((error) => console.log(error));
});

function returnTable() {
  router.push("/import-receipts");
}
</script>

<template>
  <div class="card px-0 pt-0 pb-2">
    <div class="card-body p-5">
      <ul class="p-0 m-0 w-50">
        <li class="d-table py-1 w-100">
          <span class="d-table-cell w-25 py-1 px-2">Thời điểm tạo:</span>
          <div class="d-table-cell">
            {{ importReceipt.createdTime }}
          </div>
        </li>
        <li class="d-table py-1 w-100">
          <span class="d-table-cell w-25 py-1 px-2">Ghi chú:</span>
          <div class="d-table-cell">
            {{ importReceipt.note }}
          </div>
        </li>
        <li class="d-table py-1 w-100">
          <span class="d-table-cell w-25 py-1 px-2">Nhà cung cấp:</span>
          <div class="d-table-cell">
            {{ importReceipt.supplierName }}
          </div>
        </li>
        <li class="d-table py-1 w-100">
          <span class="d-table-cell w-25 py-1 px-2">Tổng tiền:</span>
          <div class="d-table-cell">
            {{ importReceipt.totalPrice }}
          </div>
        </li>
        <li class="d-table py-1 w-100">
          <span class="d-table-cell w-25 py-1 px-2">Nhân viên nhập:</span>
          <div class="d-table-cell">
            {{ importReceipt.user?.fullName }}
          </div>
        </li>
      </ul>
      <div class="py-1">
        <h4>Chi tiết phiếu nhập kho</h4>
        <div
              class="col-md-12 table-responsive"
            >
              <table class="table table-striped">
                <thead class="table-dark">
                  <tr>
                    <th
                      class="text-start text-uppercase text-head-table opacity-7 align-top"
                    >
                      Tên sản phẩm
                    </th>
                    <th
                      class="text-start text-uppercase text-head-table opacity-7 align-top"
                    >
                      Giá
                    </th>
                    <th
                      class="text-start text-uppercase text-head-table opacity-7 align-top"
                    >
                      Số lượng
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="ird in importReceipt.importReceiptDetails">
                    <tr>
                      <td
                        class="align-middle text-start text-sm text-body-table"
                      >
                        <p class="text-xs text-body-table mb-0 text-start">
                          {{ ird.variant.name }}
                        </p>
                      </td>
                      <td class="align-middle text-start text-sm">
                        <p class="text-xs text-body-table mb-0 text-start">
                          {{ ird.price }}
                        </p>
                      </td>
                      <td class="align-middle text-start text-sm">
                        <p class="text-xs text-body-table mb-0 text-start">
                          {{ ird.quantity }}
                        </p>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
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