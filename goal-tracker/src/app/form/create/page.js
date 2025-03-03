"use client";

import { useActionState } from "react";
// import { createUser } from "@/app/form/actions";

import { createGoal } from "../../../app/form/create/actions";
const initialState = {
  message: "",
};

export default function Signup() {
  const [state, formAction, pending] = useActionState(createGoal, initialState);

  return (
    <div>
      <main>
        <section id="hero">
          <form action={formAction}>
            <table className="table-width">
              <thead>
                <tr>
                  <td colSpan="2">
                    <p>add a goal</p>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <label htmlFor="goal">goal</label>
                  </td>
                  <td>
                    <input type="text" id="goal" name="goal" required />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="description">Description</label>
                  </td>
                  <td>
                    <input
                      type="description"
                      id="description"
                      name="description"
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="status">status</label>
                  </td>
                  <td>
                    <select id="status" name="status" required>
                      <option value="Not_started">Not started</option>
                      <option value="In_progress">In progress</option>
                      <option value="Pending">Pending</option>
                      <option value="Finished">Finished</option>
                    </select>
                  </td>
                </tr>

                <tr>
                  <td colSpan="2">
                    <p aria-live="polite">{state?.message}</p>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2">
                    <p>keys</p>
                  </td>
                </tr>
              </tfoot>
            </table>
            <button disabled={pending}>Add</button>
          </form>
        </section>
      </main>
    </div>
  );
}
