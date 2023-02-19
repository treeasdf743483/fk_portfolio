package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import form.InputForm;

/**
 * Servlet implementation class Detail2
 */
@WebServlet("/Detail2")
public class Detail2 extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public Detail2() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());

		response.setContentType("text/html; charset=UTF-8");
		request.setCharacterEncoding("UTF-8");
		doPost(request,response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub


				// TODO Auto-generated method stub
				response.setContentType("text/html; charset=UTF-8");
				request.setCharacterEncoding("UTF-8");

				String[] comment = new String[7000];
				String detail = "";
				String thema = "";
				String basis = "";
				int i = 0;

				int cntThema = Integer.parseInt(request.getParameter("cntThema"));
				System.out.println("cntThema" + cntThema);


				// ��`
				//入力値を取得
				//DBに入力値を挿入
				//次の画面へ遷移

				InputForm nobelForm = new InputForm();

				thema= (String) (request.getParameter("thema"));



				HttpSession session = request.getSession();


				//�R�l�N�V����
				Connection conn = null;

				//�X�e�[�g�����g
				PreparedStatement ps = null;

				//���U���g�Z�b�g
				ResultSet rs = null;

				try {



					// 先程インストールしたMySQLのドライバを指定
					Class.forName("com.mysql.cj.jdbc.Driver");

					//Oracle�ɐڑ�
					conn = DriverManager.getConnection("jdbc:mysql://localhost/NOBELDB", "joilyd4023", "adlf102");
					StringBuffer sqlBuffer = new StringBuffer();


					Statement stmt = conn.createStatement();


					String sql = "select comment from comment_T where theory = ? order by commentNo";
					ps = conn.prepareStatement(sql);

			            ps.setString(1,thema);

			            System.out.println(thema);





					rs = ps.executeQuery();
					while (rs.next()) {
						comment[i] = rs.getString("comment");
						System.out.println(comment[i]);
						i++;
					}

					System.out.println(comment[0]);

					//request.setAttribute("bean", arraylist);

					rs.close();
					//Result���N���[�Y
					ps.close();



					request.setAttribute("commentArr", comment);
					request.setAttribute("cntThema", cntThema);
					request.setAttribute("cnt", i + 1);
					request.setAttribute("theory", thema);

					RequestDispatcher rd = request.getRequestDispatcher("/pages/comment.jsp");

					rd.forward(request, response);
				} catch (Exception x) {
					x.printStackTrace();
					RequestDispatcher rd = request.getRequestDispatcher("/pages/nobel.jsp");

					rd.forward(request, response);

				} finally {
					try {
						if (rs != null) {
							//ResultSet���N���[�Y
							rs.close();
						}
						if (ps != null) {
							//Statement���N���[�Y
							ps.close();
						}
						//connection���N���[�Y
						conn.close();

					} catch (Exception e) {
						e.printStackTrace();
					}

				}


	}

}
