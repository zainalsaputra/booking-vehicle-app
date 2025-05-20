import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import axios from "axios";
import { Menu } from "@headlessui/react";
import {
  Card, CardHeader, CardBody, Typography, Button, Dialog,
  DialogHeader, DialogBody, DialogFooter, Chip,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export function Approver() {
  const [openReject, setOpenReject] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [pengajuanData, setPengajuanData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("Token tidak ditemukan!");
        return;
      }

      console.log(id);

      await axios.get(`http://localhost:8000/api/vehicle-requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setPengajuanData((prev) => prev.filter((item) => item.id !== selectedItem.id));
      setCurrentPage(1);
      setOpenReject(false);
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

        const response = await axios.get("http://localhost:8000/api/approvals/pending", {
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
      <Dialog open={openReject} handler={() => setOpenReject(false)}>
        <DialogHeader>Hapus Pengajuan</DialogHeader>
        <DialogBody>
          Apakah Anda ingin menolak pengajuan dari <strong>{selectedItem?.nama_kantor}</strong>?
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="gray" onClick={() => setOpenReject(false)}>Batal</Button>
          <Button variant="gradient" color="red" onClick={() => handleReject(selectedItem?.id)}>Hapus</Button>
        </DialogFooter>
      </Dialog>

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">Daftar Pengajuan</Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["No", "Kantor", "Kendaraan", "Spesifikasi", "Supir", "Tujuan", "Tanggal", "Aksi"].map((el) => (
                  <th key={el} className="border-b py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.id}>
                  <td className="py-3 px-5">{indexOfFirstItem + index + 1}</td>

                  <td className="py-3 px-5">
                    <Typography className="text-sm font-semibold text-blue-gray-600">{item.kantor}</Typography>
                    <Typography className="text-xs font-normal text-blue-gray-500">{item.wilayah_kantor}</Typography>
                  </td>

                  <td className="py-3 px-5">
                    <Typography className="text-sm font-semibold text-blue-gray-600">{item.nama_kendaraan}</Typography>
                    <Typography className="text-xs font-normal text-blue-gray-500">{item.plat_nomor}</Typography>
                  </td>
                
                  <td className="py-3 px-5">
                    <Typography className="text-sm font-semibold text-blue-gray-600">{item.jenis_kendaraan}</Typography>
                    <Typography className="text-xs font-normal text-blue-gray-500">{item.pemilik}</Typography>
                  </td>

                  <td className="py-3 px-5">
                    <Typography className="text-sm font-semibold text-blue-gray-600">{item.nama_pengemudi}</Typography>
                    <Typography className="text-xs font-normal text-blue-gray-500">{item.nomor_telepon}</Typography>
                  </td>

                  <td className="py-3 px-5">
                    <Typography className="text-sm text-blue-gray-600">{item.tujuan}</Typography>
                  </td>

                  <td className="py-3 px-5">
                    <Typography className="text-xs text-blue-gray-600">
                      {new Date(item.tanggal_mulai).toLocaleDateString()} - {new Date(item.tanggal_selesai).toLocaleDateString()}
                    </Typography>
                  </td>

                  {/* <td className="py-3 px-5">
                    <Chip
                      variant="gradient"
                      color={item.status === "pending" ? "amber" : item.status === "approved" ? "green" : "red"}
                      value={item.status}
                      className="py-0.5 px-0 text-[11px] font-medium w-fit"
                    />
                  </td> */}

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
                                onClick={() => setSelectedItem(item)}
                                className={`${active ? "bg-gray-100" : ""} group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700`}
                              >
                                <PencilIcon className="mr-2 h-4 w-4" /> Update
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
                                <TrashIcon className="mr-2 h-4 w-4" /> Delete
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
