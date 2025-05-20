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
  const [pengajuanData, setPengajuanData] = useState([]);
  const [approvers, setApprovers] = useState([]);

  const [formData, setFormData] = useState({
    purpose: "",
    office_id: "",
    vehicle_id: "",
    driver_id: "",
    start_date: "",
    end_date: "",
    approver_ids: [],
  });

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

  useEffect(() => {
    setApprovers([
      { id: 1, name: "Andi HRD", email: "andi@kantor.com" },
      { id: 2, name: "Siti Finance", email: "siti@kantor.com" },
    ]);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApproverToggle = (id) => {
    setFormData((prev) => {
      const updatedIds = prev.approver_ids.includes(id)
        ? prev.approver_ids.filter((i) => i !== id)
        : [...prev.approver_ids, id];
      return { ...prev, approver_ids: updatedIds };
    });
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      // const response = await axios.post(
      //   "http://localhost:8000/api/vehicle-requests",
      //   {
      //     purpose: formData.purpose,
      //     office_id: formData.office_id,
      //     vehicle_id: formData.vehicle_id,
      //     driver_id: formData.driver_id,
      //     start_date: formData.start_date,
      //     end_date: formData.end_date,
      //     approver_ids: formData.approver_ids,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      console.log(formData);

      // setPengajuanData((prev) => [...prev, response.data]);
      // setFormData({});
      // setOpen(false);
    } catch (error) {
      console.error("Gagal membuat pengajuan:", error);
    }
  };

  const handleDelete = () => {
    setPengajuanData((prev) => prev.filter((item) => item.id !== selectedItem.id));
    setOpenDelete(false);
  };

  useEffect(() => {
    const fetchPengajuan = async () => {
      try {
        const token = localStorage.getItem("accessToken");
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
          {/* Approvers (multiple) */}
          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700">Approver</label>
            <div className="space-y-2">
              {approvers.map((approver) => (
                <label key={approver.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={approver.id}
                    checked={formData.approver_ids.includes(approver.id)}
                    onChange={() => handleApproverToggle(approver.id)}
                  />
                  {approver.name} ({approver.email})
                </label>
              ))}
            </div>
          </div>

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
          <Button variant="gradient" color="red" onClick={handleDelete}>Hapus</Button>
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
              {pengajuanData.map((item, index) => (
                <tr key={item.id}>
                  <td className="py-3 px-5">{index + 1}</td>
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
        </CardBody>
      </Card>
    </div>
  );
}
