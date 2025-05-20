import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import axios from "axios";
import { Menu } from "@headlessui/react";
import {
  Card, CardHeader, CardBody, Typography, Button, Dialog,
  DialogHeader, DialogBody, DialogFooter, Input, Chip,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export function Tables() {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [pengajuanData, setPengajuanData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


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
    { id: 2, name: "Andi HRD", email: "andi@kantor.com" },
    { id: 3, name: "Siti Finance", email: "siti@kantor.com" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({});
    setSelectedItem(null);
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("Token tidak ditemukan!");
        return;
      }

      const { approver1_id, approver2_id } = formData;
      const approver_id = [approver1_id, approver2_id];
      if (!approver1_id || !approver2_id || approver1_id === approver2_id) {
        alert("Mohon pilih dua penyetuju yang berbeda.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/vehicle-requests",
        {
          purpose: formData.purpose,
          office_id: formData.office_id,
          vehicle_id: formData.vehicle_id,
          driver_id: formData.driver_id,
          start_date: formData.start_date,
          end_date: formData.end_date,
          approver_ids: approver_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // setPengajuanData((prev) => [response.data, ...prev]);
      setCurrentPage(1);
      resetForm();
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Gagal membuat pengajuan:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("Token tidak ditemukan!");
        return;
      }

      console.log(id);

      await axios.delete(`http://localhost:8000/api/vehicle-requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setPengajuanData((prev) => prev.filter((item) => item.id !== selectedItem.id));
      setCurrentPage(1);
      setOpenDelete(false);
    } catch (error) {
      console.error("Gagal menghapus pengajuan:", error);
    }
  };

  useEffect(() => {
    const fetchPengajuan = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("Token tidak ditemukan!");
          return;
        }

        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTime) {
          console.error("Token sudah expired! Silakan login kembali.");
          return;
        }

        const response = await axios.get("http://localhost:8000/api/vehicle-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPengajuanData(response.data);
      } catch (error) {
        console.error("Gagal memuat data pengajuan:", error);
      }
    };

    fetchPengajuan();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pengajuanData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pengajuanData.length / itemsPerPage);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Dialog open={open} handler={() => setOpen(!open)}>
        <DialogHeader>Buat Pengajuan</DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <Input label="Tujuan" name="purpose" value={formData.purpose || ""} onChange={handleChange} />
          <select name="office_id" value={formData.office_id || ""} onChange={handleChange} className="border p-2 rounded">
            <option value="">Pilih Kantor</option>
            {offices.map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
          <select name="vehicle_id" value={formData.vehicle_id || ""} onChange={handleChange} className="border p-2 rounded">
            <option value="">Pilih Kendaraan</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
          <select name="driver_id" value={formData.driver_id || ""} onChange={handleChange} className="border p-2 rounded">
            <option value="">Pilih Pengemudi</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <Input label="Tanggal Mulai" type="datetime-local" name="start_date" value={formData.start_date || ""} onChange={handleChange} />
          <Input label="Tanggal Selesai" type="datetime-local" name="end_date" value={formData.end_date || ""} onChange={handleChange} />
          <select
            name="approver1_id"
            value={formData.approver1_id || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Pilih Penyetuju 1</option>
            {approvers.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.email})
              </option>
            ))}
          </select>
          <select
            name="approver2_id"
            value={formData.approver2_id || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full mt-2"
          >
            <option value="">Pilih Penyetuju 2</option>
            {approvers.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.email})
              </option>
            ))}
          </select>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setOpen(false)}>Batal</Button>
          <Button variant="gradient" color="green" onClick={handleCreate}>Simpan</Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
        <DialogHeader>Hapus Pengajuan</DialogHeader>
        <DialogBody>
          Apakah Anda yakin ingin menghapus pengajuan dari <strong>{selectedItem?.nama_kantor}</strong>?
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>Batal</Button>
          <Button variant="gradient" color="red" onClick={() => handleDelete(selectedItem?.id)}>Hapus</Button>
        </DialogFooter>
      </Dialog>

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">Daftar Pengajuan</Typography>
          <Button onClick={() => setOpen(true)} color="white" className="normal-case">Buat Pengajuan</Button>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["No", "Kantor", "Kendaraan", "Supir", "Tanggal", "Status", "Aksi"].map((el) => (
                  <th key={el} className="border-b py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">{el}</Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.id}>
                  <td className="py-3 px-5">{indexOfFirstItem + index + 1}</td>
                  <td className="py-3 px-5">
                    <Typography className="text-sm font-semibold text-blue-gray-600">{item.nama_kantor}</Typography>
                    <Typography className="text-xs font-normal text-blue-gray-500">{item.wilayah_kantor}</Typography>
                  </td>
                  <td className="py-3 px-5">
                    <Typography className="text-sm font-semibold text-blue-gray-600">{item.nama_kendaraan}</Typography>
                    <Typography className="text-xs font-normal text-blue-gray-500">{item.nomor_plat} - {item.jenis_kendaraan}</Typography>
                  </td>
                  <td className="py-3 px-5">
                    <Typography className="text-sm font-semibold text-blue-gray-600">{item.nama_pengemudi}</Typography>
                    <Typography className="text-xs font-normal text-blue-gray-500">{item.telepon_pengemudi}</Typography>
                  </td>
                  <td className="py-3 px-5">
                    <Typography className="text-xs text-blue-gray-600">
                      {new Date(item.tanggal_mulai).toLocaleDateString()} - {new Date(item.tanggal_selesai).toLocaleDateString()}
                    </Typography>
                  </td>
                  <td className="py-3 px-5">
                    <Chip
                      variant="gradient"
                      color={item.status === "pending" ? "amber" : item.status === "approved" ? "green" : "red"}
                      value={item.status}
                      className="py-0.5 px-2 text-[11px] font-medium w-fit"
                    />
                  </td>
                  <td className="py-3 px-5">
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
                                  // Handle update di sini kalau diperlukan
                                }}
                                className={`${active ? "bg-gray-100" : ""} group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700`}
                              >
                                <PencilIcon className="mr-2 h-4 w-4" />Update
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
                                className={`${active ? "bg-gray-100" : ""} group flex w-full items-center rounded-md px-2 py-2 text-sm text-red-600`}
                              >
                                <TrashIcon className="mr-2 h-4 w-4" />Delete
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-center gap-4 p-3 mt-4 border rounded-lg">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border-gray-500 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              Sebelumnya
            </Button>

            <span className="text-sm font-medium text-gray-700">
              Halaman <span className="font-semibold">{currentPage}</span> dari <span className="font-semibold">{totalPages}</span>
            </span>

            <Button
              variant="outlined"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border-gray-500 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              Berikutnya
            </Button>
          </div>

        </CardBody>
      </Card>
    </div>
  );
}
