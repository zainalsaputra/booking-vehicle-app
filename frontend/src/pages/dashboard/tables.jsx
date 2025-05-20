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
import { projectsTableData } from "@/data";
import { useState } from "react";

export function Tables() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

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

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {/* Floating Form Modal */}
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Tambah Author</DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <Input label="Nama" name="name" value={formData.name} onChange={handleChange} />
          <Input label="Email" name="email" value={formData.email} onChange={handleChange} />
          <Input label="Jabatan" name="jobTitle" value={formData.jobTitle} onChange={handleChange} />
          <Input label="Departemen" name="jobDept" value={formData.jobDept} onChange={handleChange} />
          <Input label="Tanggal Mulai" name="date" value={formData.date} onChange={handleChange} />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
            Batal
          </Button>
          <Button variant="gradient" color="green" onClick={handleSubmit}>
            Simpan
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Authors Table */}
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex justify-between items-center w-full">
            <Typography variant="h6" color="white">
              Authors Table
            </Typography>
            <Button onClick={handleOpen} color="white" >
              Buat Pengajuan
            </Button>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["no", "kantor", "kendaraan", "supir", "tanggal", "status", ""].map((el) => (
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
              {authorsData.map(
                ({ office, email, job, online, date }, key) => {
                  const className = `py-3 px-5 ${key === authorsData.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                    }`;

                  return (
                    <tr key={key}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {name}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {job[0]}
                        </Typography>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          {job[1]}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={online ? "green" : "blue-gray"}
                          value={online ? "online" : "offline"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {date}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-blue-gray-600"
                        >
                          <EllipsisVerticalIcon
                            strokeWidth={2}
                            className="h-5 w-5 text-inherit"
                          />
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Tables;
