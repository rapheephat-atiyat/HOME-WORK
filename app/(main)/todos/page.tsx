"use client"

import { Button } from "@/components/tailgrids/core/button";
import { Badge } from "@/components/tailgrids/core/badge";
import { TableRoot, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/tailgrids/core/table";
import { useEffect, useState } from "react";
import { type TODO, fetchTodo } from "./todo";
import { Spinner } from "@/components/tailgrids/core/spinner";
import { Toggle } from "@/components/tailgrids/core/toggle";
import { NativeSelect, NativeSelectOption } from "@/components/tailgrids/core/native-select";
import { Pagination } from "@/components/tailgrids/core/pagination";
import { Check, ClockThree, Plus, Trash1 } from "@tailgrids/icons";
import { Backdrop } from "@/components/tailgrids/core/overlay";
import { Dialog, DialogBody, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/tailgrids/core/dialog";
import { Label } from "@/components/tailgrids/core/label";
import { TextField } from "@/components/tailgrids/core/text-field";
import { Input } from "@/components/tailgrids/core/input";
import { checkLogin } from "@/utils/login";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  useEffect(() => checkLogin(router, "/todos"), [router])
  const [todosRaw, setTodosRaw] = useState<TODO[]>([])
  const [todos, setTodos] = useState<TODO[]>([])
  const [loading, setLoading] = useState(true)
  const [waitingOnly, setWaitingOnly] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState<number>(5)

  const [totalPages, setTotalPages] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    const _todorawStr = localStorage.getItem("todoRaw")

    if (_todorawStr === null || _todorawStr === "undefined") {
      setLoading(true)
      fetchTodo()
        .then((mockTodos) => {
          setTodosRaw(mockTodos)
        })
        .catch((err) => {
          setTodosRaw([])
        })
        .finally(() => {
          setLoading(false)
        })
      return
    }

    try {
      if (Array.isArray(JSON.parse(_todorawStr))) {
        setTodosRaw(JSON.parse(_todorawStr) as TODO[])
      } else {
        setTodosRaw([])
      }
    } catch (err) {
      setTodosRaw([])
    } finally {
      setLoading(false)
    }
  }, [])

  // onload => [once] => todoRaw
  // useEffect(() => {
  //   fetchTodo()
  //     .then((data) => setTodosRaw(data as TODO[]))
  //     .catch(() => setTodosRaw([]))
  //     .finally(() => setLoading(false))
  // }, [])

  useEffect(() => {
    if (loading) return

    localStorage.setItem("todoRaw", JSON.stringify(todosRaw))
  }, [todosRaw, loading])

  useEffect(() => {
    if (waitingOnly) {
      setTodos(todosRaw.filter((todo) => !todo.completed))
    } else {
      setTodos(todosRaw)
    }
  }, [waitingOnly, todosRaw])

  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(todos.length / itemsPerPage)))
  }, [todos, itemsPerPage])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  const addTodo = () => {
    const titleDom = document.getElementById("title") as HTMLInputElement | null

    if (!titleDom || titleDom.value.trim() === "") return

    const id = todosRaw.length
      ? Math.max(...todosRaw.map((todo) => Number(todo.id) || 0)) + 1
      : 1

    const newTodo: TODO = {
      id,
      userId: 1,
      title: titleDom.value.trim(),
      completed: false
    }

    setTodosRaw([...todosRaw, newTodo])
    setCurrentPage(1)
    titleDom.value = ""
    setShowDialog(false)
  }

  const deleteTodo = (id: TODO["id"]) => {
    setTodosRaw(todosRaw.filter((todo) => todo.id !== id))
  }

  const makeDone = (id: number) => {
    setTodosRaw(todosRaw.map((todo) =>
      todo.id === id ? { ...todo, completed: true } : todo
    ))
  }

  return (
    <>
      <main className="todo-page" aria-label="Todos">
        <div className="mb-1.75 flex items-center justify-between gap-3 max-sm:flex-wrap">
          <div className="flex items-center gap-1.75">
            <Toggle
              label="Show only"
              checked={waitingOnly}
              onChange={(e) => {
                setWaitingOnly(e.target.checked)
                setCurrentPage(1)
              }}
            />
            <Badge color="warning" size="lg">waiting
              <ClockThree size={14} aria-hidden="true" />
            </Badge>
          </div>
          <div className="w-56.25 max-sm:w-full">
            <NativeSelect
              value={itemsPerPage}
              onChange={(event) => {
                setItemsPerPage(Number(event.target.value))
                setCurrentPage(1)
              }}
            >
              <NativeSelectOption value="5">5 items per page</NativeSelectOption>
              <NativeSelectOption value="10">10 items per page</NativeSelectOption>
              <NativeSelectOption value="50">50 items per page</NativeSelectOption>
            </NativeSelect>
          </div>
        </div>

        <div className="overflow-x-auto">
          <TableRoot className="mb-3.5 w-full min-w-145 rounded-none border-0 border-collapse align-middle [&_td]:border-b [&_td]:border-[#dee2e6] [&_td]:p-1.75 [&_th]:h-12.25 [&_th]:border-[#dee2e6] [&_th]:p-1.75">
            <TableHeader className="bg-[#212529] text-white [&_th]:text-sm [&_th]:font-bold">
              <TableRow>
                <TableHead scope="col" className="w-14.5 text-center">ID</TableHead>
                <TableHead scope="col" className="text-center">Title</TableHead>
                <TableHead scope="col" className="w-37.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    Completed
                    <Button onClick={() => setShowDialog(true)} size="xs" iconOnly className="h-8.5 w-9.5 shrink-0 rounded bg-[#0d6efd] p-0 text-white hover:bg-[#0b5ed7] [&>svg]:size-3.5" aria-label="Add todo">
                      <Plus size={14} aria-hidden="true" />
                    </Button>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Spinner className="mx-auto" />
                  </TableCell>
                </TableRow>
              )}

              {!loading && todos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <p className="text-center text-red-500">No data, may be connection refused (refresh again)</p>
                  </TableCell>
                </TableRow>
              )}

              {!loading && todos
                .filter((todo, index) => {
                  const lower = (currentPage - 1) * itemsPerPage
                  const upper = lower + itemsPerPage
                  return index >= lower && index < upper
                })
                .map((todo) => (
                  <TableRow key={todo.id} className="odd:bg-[#f2f2f2]">
                    <TableCell className="w-14.5 text-center">
                      <Badge color="gray" className="rounded-[5px] bg-[#6c757d] px-1.75 py-0.75 text-xs leading-none font-bold text-white">{todo.id}</Badge>
                    </TableCell>
                    <TableCell className="font-normal text-[#111]">{todo.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {todo.completed ? (
                          <Button
                            size="xs"
                            iconOnly
                            className="bg-green-800 hover:bg-green-900 w-24"
                          >
                            Done
                            <Check />
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            iconOnly
                            onClick={() => makeDone(todo.id)}
                            className="bg-yellow-500 hover:bg-yellow-700 w-24"
                          >
                            Waiting
                            <ClockThree />
                          </Button>
                        )}
                        <Button
                          variant="danger"
                          size="xs"
                          iconOnly
                          aria-label={`Delete todo ${todo.id}`}
                          onClick={() => deleteTodo(todo.id)}
                          className="size-9 shrink-0 rounded-lg p-0 text-center text-white [&>svg]:size-3.5 [&>svg]:text-white"
                        >
                          <Trash1 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </TableRoot>
        </div>

        <div className="mb-2 flex gap-2 mx-auto justify-between items-center w-sm">
          <Button
            appearance="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            First
          </Button>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            sideLayout="icon"
          />
          <Button
            appearance="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            Last
          </Button>
        </div>
      </main>

      <Backdrop isOpen={showDialog} onOpenChange={setShowDialog}>
        <Dialog>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Plus className="bg-blue-100 rounded-md" /> Add todo
            </DialogTitle>
            <DialogDescription>
              Make changes to your todo list here. Click Add todo when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <DialogBody>
            <form
              className="flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault()
                addTodo()
              }}
            >
              <TextField className="flex flex-col gap-1.5">
                <Label>ID (auto generate)</Label>
                <Input
                  disabled
                  className="w-full"
                  value={
                    todosRaw.length
                      ? Math.max(...todosRaw.map((todo) => Number(todo.id) || 0)) + 1
                      : 1
                  }
                  readOnly
                />
              </TextField>

              <TextField className="flex flex-col gap-1.5">
                <Label>Title</Label>
                <Input
                  autoFocus
                  id="title"
                  placeholder="ใส่งานที่ต้องการเพิ่ม"
                  className="w-full"
                  required
                />
              </TextField>
            </form>
          </DialogBody>

          <DialogFooter>
            <DialogClose appearance="outline">Cancel</DialogClose>
            <Button onClick={addTodo}>Add todo</Button>
          </DialogFooter>
        </Dialog>
      </Backdrop>
    </>
  )
}
