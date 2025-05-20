import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
} from "@material-tailwind/react";

import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

import { Menu } from "@headlessui/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export function Tables() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);


  const [authorsData, setAuthorsData] = useState([
    {
      img: "https://docs.material-tailwind.com/img/face-1.jpg",
      name: "John Michael",
      email: "john@creative-tim.com",
      job: ["Manager", "Organization"],
      online: true,
      date: "23/04/18",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    jobTitle: "",
    jobDept: "",
    status: true,
    date: "",
  });

  const [pengajuanData, setPengajuanData] = useState([
    {
      id: 3,
      tujuan: "Mengambil Barang",
      nama_kantor: "Kantor Cabang I",
      wilayah_kantor: "Malang",
      nama_pengemudi: "Budi Santoso",
      telepon_pengemudi: "08234567890",
      nama_kendaraan: "Toyota Hilux",
      jenis_kendaraan: "Pickup",
      nomor_plat: "N 1234 AB",
      kepemilikan: "company",
      tanggal_mulai: "2025-05-25 08:00:00",
      tanggal_selesai: "2025-07-25 08:00:00",
      status_persetujuan_1: "pending",
      status_persetujuan_2: "pending",
      status: "pending",
      created_at: "2025-05-20T11:49:21.000000Z",
      updated_at: "2025-05-20T11:49:21.000000Z",
    },
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = () => {
    const newAuthor = {
      img: "https://docs.material-tailwind.com/img/face-3.jpg",
      name: formData.name,
      email: formData.email,
      job: [formData.jobTitle, formData.jobDept],
      online: formData.status,
      date: formData.date,
    };
    setAuthorsData([...authorsData, newAuthor]);
    setFormData({
      name: "",
      email: "",
      jobTitle: "",
      jobDept: "",
      status: true,
      date: "",
    });
    handleOpen(); // Tutup dialog
  };

  const vehicles = [
    { id: 1, name: "Toyota Hilux" },
    { id: 2, name: "Suzuki Carry" },
  ];

  const offices = [
    { id: 1, name: "Kantor Cabang I", region: "Malang" },
    { id: 2, name: "Kantor Pusat", region: "Surabaya" },
  ];

  const drivers = [
    { id: 1, name: "Budi Santoso", phone: "08234567890" },
    { id: 2, name: "Rina Yuliati", phone: "085700011122" },
  ];

  const approvers = [
    { id: 1, name: "Pak Agus" },
    { id: 2, name: "Bu Sari" },
  ];

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {/* Floating Form Modal */}
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Buat Pengajuan</DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <Input
            label="Tujuan"
            name="purpose"
            value={formData.purpose || ""}
            onChange={handleChange}
          />

          <select
            name="office_id"
            value={formData.office_id || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Pilih Kantor</option>
            {offices.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>

          <select
            name="vehicle_id"
            value={formData.vehicle_id || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Pilih Kendaraan</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>

          <select
            name="driver_id"
            value={formData.driver_id || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Pilih Pengemudi</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <Input
            label="Tanggal Mulai"
            type="datetime-local"
            name="start_date"
            value={formData.start_date || ""}
            onChange={handleChange}
          />

          <Input
            label="Tanggal Selesai"
            type="datetime-local"
            name="end_date"
            value={formData.end_date || ""}
            onChange={handleChange}
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleOpen}>
            Batal
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={() => {
              const vehicle = vehicles.find((v) => v.id == formData.vehicle_id);
              const office = offices.find((o) => o.id == formData.office_id);
              const driver = drivers.find((d) => d.id == formData.driver_id);

              const newPengajuan = {
                id: Math.floor(Math.random() * 10000),
                tujuan: formData.purpose,
                nama_kantor: office?.name,
                wilayah_kantor: office?.region,
                nama_kendaraan: vehicle?.name,
                nomor_plat: "N 9999 ZZ", // hardcode/demo
                jenis_kendaraan: "Pickup", // hardcode/demo
                nama_pengemudi: driver?.name,
                telepon_pengemudi: driver?.phone,
                tanggal_mulai: formData.start_date,
                tanggal_selesai: formData.end_date,
                status: "pending",
              };

              setPengajuanData((prev) => [...prev, newPengajuan]);
              setFormData({});
              handleOpen();
            }}
          >
            Simpan
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={openDelete} handler={() => setOpenDelete(!openDelete)}>
        <DialogHeader>Hapus Pengajuan</DialogHeader>
        <DialogBody>
          Apakah Anda yakin ingin menghapus pengajuan dari{" "}
          <strong>{selectedItem?.nama_kantor}</strong>?
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>
            Batal
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={() => {
              setPengajuanData((prev) =>
                prev.filter((item) => item.id !== selectedItem.id)
              );
              setOpenDelete(false);
            }}
          >
            Hapus
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Authors Table */}
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex justify-between items-center w-full">
            <Typography variant="h6" color="white">
              Daftar Pengajuan
            </Typography>
            <Button onClick={handleOpen} color="white" className="normal-case">
              Buat Pengajuan
            </Button>
          </div>
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] min-h-[140px] table-auto">
            <thead>
              <tr>
                {["No", "Kantor", "Kendaraan", "Supir", "Tanggal", "Status", "Aksi"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pengajuanData.map((item, index) => {
                const className = `py-3 px-5 ${index === pengajuanData.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;
                return (
                  <tr key={item.id}>
                    <td className={className}>{index + 1}</td>
                    <td className={className}>
                      <Typography className="text-sm font-semibold text-blue-gray-600">
                        {item.nama_kantor}
                      </Typography>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {item.wilayah_kantor}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-sm font-semibold text-blue-gray-600">
                        {item.nama_kendaraan}
                      </Typography>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {item.nomor_plat} - {item.jenis_kendaraan}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-sm font-semibold text-blue-gray-600">
                        {item.nama_pengemudi}
                      </Typography>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {item.telepon_pengemudi}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs text-blue-gray-600">
                        {new Date(item.tanggal_mulai).toLocaleDateString()} - {new Date(item.tanggal_selesai).toLocaleDateString()}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Chip
                        variant="gradient"
                        color={
                          item.status === "pending"
                            ? "amber"
                            : item.status === "approved"
                              ? "green"
                              : "red"
                        }
                        value={item.status}
                        className="py-0.5 px-2 text-[11px] font-medium w-fit"
                      />
                    </td>
                    <td className={className}>
                      <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button className="p-1 rounded-full hover:bg-gray-100">
                          <EllipsisVerticalIcon className="w-5 h-5 text-blue-gray-600" />
                        </Menu.Button>

                        <Menu.Items className="absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="px-1 py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setOpenEdit(true);
                                  }}
                                  className={`${active ? "bg-gray-100" : ""
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700`}
                                >
                                  <PencilIcon className="mr-2 h-4 w-4" />
                                  Update
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setOpenDelete(true);
                                  }}
                                  className={`${active ? "bg-gray-100" : ""
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm text-red-600`}
                                >
                                  <TrashIcon className="mr-2 h-4 w-4" />
                                  Delete
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Menu>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

    </div>
  );
}

export default Tables;
