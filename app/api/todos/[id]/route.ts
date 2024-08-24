import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { title, completed } = await request.json();

    // Construct the data object dynamically based on the provided fields
    const data: any = {};
    if (title !== undefined) data.title = title;
    if (completed !== undefined) data.completed = completed;

    const updatedTodo = await prisma.todo.update({
      where: { id: parseInt(params.id) },
      data,
    });

    return NextResponse.json(updatedTodo);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.todo.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: "Todo deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
