<%-- eslint-begin --%>

 <%-- JSP Comments are ignored --%>
 <!-- As are XML Comments -->
 /* This is a comment */
function foo(b) {
    var a = <c:tag attrib="foo"/> <%-- jsp-result:{} --%>;
    a.ref = b;
    a.value = ${foobar} /* jsp-result:'short' */;
    <c:choose>
        <c:when test="${solrConfigured}">
    a.result = 7; // seven is the perfect number
        </c:when>
        <c:otherwise>
    a.result = 42;
        </c:otherwise>
    </c:choose>
    return a;
}
foo(22);
<%-- eslint-end --%>
